param([string]$LocalStateDirectory = "$env:LOCALAPPDATA\PulsePass\demo-delivery")
$ErrorActionPreference='Stop'
$api='http://127.0.0.1:8080/api'
$container=(docker inspect pulsepass-postgres|ConvertFrom-Json)[0]
if(-not ($container.NetworkSettings.Ports.'5432/tcp'|Where-Object HostPort -eq '5433')){throw 'Expected PostgreSQL host port 5433'}
$listener=Get-NetTCPConnection -LocalPort 8080 -State Listen | Select-Object -First 1
if(-not $listener){throw 'Backend 8080 listener absent'}
$connections=Get-NetTCPConnection -OwningProcess $listener.OwningProcess -State Established
if(-not ($connections|Where-Object {$_.RemotePort -eq 5433}) -or ($connections|Where-Object {$_.RemotePort -eq 5434})){throw 'Backend database socket isolation mismatch'}
$dbUser=($container.Config.Env|Where-Object{$_ -like 'POSTGRES_USER=*'}) -replace '^POSTGRES_USER=',''
function Sql([string]$sql){
 $guard="BEGIN; DO `$`$ BEGIN IF current_database() <> 'pulsepass' THEN RAISE EXCEPTION 'Wrong database'; END IF; END `$`$; "
 $result=($guard+$sql+'; COMMIT;')|docker exec -i pulsepass-postgres psql -X -q -v ON_ERROR_STOP=1 -U $dbUser -d pulsepass -At
 if($LASTEXITCODE -ne 0){throw 'Guarded SQL failed'}
 return $result
}
New-Item -ItemType Directory -Force $LocalStateDirectory|Out-Null
$secretFile=Join-Path $LocalStateDirectory 'credentials.dpapi.json'
$stateFile=Join-Path $LocalStateDirectory 'manifest.json'
$log=[System.Collections.Generic.List[object]]::new()
function Api([string]$method,[string]$path,$body=$null,[string]$token=''){
 $headers=@{};if($token){$headers.Authorization='Bearer '+$token}
 $args=@{Uri=($api+$path);Method=$method;Headers=$headers;ContentType='application/json';SkipHttpErrorCheck=$true}
 if($null -ne $body){$args.Body=($body|ConvertTo-Json -Depth 8 -Compress)}
 $r=Invoke-WebRequest @args
 $log.Add([pscustomobject]@{method=$method;path=$path;status=[int]$r.StatusCode})
 if($r.StatusCode -ge 300){throw ('HTTP '+$r.StatusCode+' at '+$path)}
 if($r.Content){return ($r.Content|ConvertFrom-Json)}
}
$actors=@(
 @{name='USER_A';username='demo_user_a';email='demo.user.a@example.test';role='USER'},
 @{name='USER_B';username='demo_user_b';email='demo.user.b@example.test';role='USER'},
 @{name='STAFF';username='demo_staff';email='demo.staff@example.test';role='STAFF'},
 @{name='ADMIN';username='demo_admin';email='demo.admin@example.test';role='ADMIN'},
 @{name='USER_RESTRICCION_EDAD';username='demo_underage';email='demo.underage@example.test';role='USER'}
)
$secrets=@{};if(Test-Path $secretFile){$secrets=Get-Content $secretFile -Raw|ConvertFrom-Json -AsHashtable}
$state=@{events=@{};tickets=@{};actors=@{}};if(Test-Path $stateFile){$state=Get-Content $stateFile -Raw|ConvertFrom-Json -AsHashtable}
function SaveState{$state|ConvertTo-Json -Depth 10|Set-Content -Encoding utf8 $stateFile}
$tokens=@{}
foreach($a in $actors){
 $exists=@(Sql "SELECT id FROM users WHERE username='$($a.username)' OR email='$($a.email)'")
 if(-not $secrets.ContainsKey($a.name)){
  if($exists.Count){throw ('Existing actor without owner-local credentials: '+$a.name)}
  $password='Pp!'+[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(18))
  $secrets[$a.name]=ConvertFrom-SecureString (ConvertTo-SecureString $password -AsPlainText -Force)
  $secrets|ConvertTo-Json|Set-Content -Encoding utf8 $secretFile
 }else{
  $secure=ConvertTo-SecureString $secrets[$a.name];$ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try{$password=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)}finally{[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)}
 }
 if(-not $exists.Count){
  $profileNames=@{USER_A=@('Mariana','Torres');USER_B=@('Andres','Rojas');STAFF=@('Camila','Vargas');ADMIN=@('Santiago','Mendoza');USER_RESTRICCION_EDAD=@('Valentina','Rojas')}
  $birth=if($a.name -eq 'USER_RESTRICCION_EDAD'){'2020-01-01'}else{'1990-01-01'}
  $registered=Api POST '/users' @{username=$a.username;email=$a.email;firstName=$profileNames[$a.name][0];lastName=$profileNames[$a.name][1];phone='3000000000';city='Santa Marta';birthDate=$birth;password=$password}
  $state.actors[$a.name]=@{username=$a.username;email=$a.email;createdByLoader=$true;role=$a.role};SaveState
  if($a.role -ne 'USER'){
   # Only this newly registered demo identity receives a privileged role. Existing actors are never changed.
   Sql "INSERT INTO user_roles(user_id,role) SELECT id,'$($a.role)' FROM users WHERE username='$($a.username)' AND email='$($a.email)' ON CONFLICT DO NOTHING"|Out-Null
  }
 }elseif(-not $state.actors.ContainsKey($a.name)){throw ('Unmanaged existing identity: '+$a.name)}
 $auth=Api POST '/auth/login' @{identifier=$a.username;password=$password}
 $password=$null;$tokens[$a.name]=$auth.accessToken
 $me=Api GET '/auth/me' $null $auth.accessToken
 if($me.username -ne $a.username -or $me.email -ne $a.email -or $a.role -notin $me.roles){throw 'Actor identity/role mismatch'}
}
$venues=@(
 @{code='DEMO-VENUE-CARIBE';name='Centro de Eventos Caribe';city='Santa Marta';capacity=500},
 @{code='DEMO-VENUE-CIENAGA';name='Auditorio Cultural Cienaga';city='Cienaga';capacity=200},
 @{code='DEMO-VENUE-ARENA';name='Arena PulsePass';city='Barranquilla';capacity=1000},
 @{code='DEMO-VENUE-MINI';name='Mini Auditorio Caribe';city='Santa Marta';capacity=2}
)
foreach($v in $venues){
 Sql "INSERT INTO venues(code,name,city,address,capacity,active) VALUES('$($v.code)','$($v.name)','$($v.city)','Calle 100, sector cultural','$($v.capacity)',true) ON CONFLICT(code) DO NOTHING; DO `$`$ BEGIN IF NOT EXISTS(SELECT 1 FROM venues WHERE code='$($v.code)' AND name='$($v.name)' AND capacity=$($v.capacity) AND active) THEN RAISE EXCEPTION 'Existing venue mismatch'; END IF; END `$`$"|Out-Null
}
$artists=Api GET '/artists/active'
$definitions=@(
 @{code='DEMO-EVENT-MUSIC-001';name='Festival Caribe PulsePass';category='MUSIC';venue='DEMO-VENUE-CARIBE';age=0;publish=$true},
 @{code='DEMO-EVENT-TECH-001';name='Encuentro de Innovacion';category='TECHNOLOGY';venue='DEMO-VENUE-ARENA';age=0;publish=$true},
 @{code='DEMO-EVENT-CULTURE-001';name='Festival Cultural Magdalena';category='CULTURE';venue='DEMO-VENUE-CIENAGA';age=0;publish=$true},
 @{code='DEMO-EVENT-DRAFT-001';name='Encuentro Universitario';category='EDUCATION';venue='DEMO-VENUE-CIENAGA';age=0;publish=$false},
 @{code='DEMO-EVENT-PUBLISH-001';name='Noche Cultural del Caribe';category='ENTERTAINMENT';venue='DEMO-VENUE-ARENA';age=0;publish=$false},
 @{code='DEMO-EVENT-AGE-001';name='Noche Tropical mayores de 18';category='MUSIC';venue='DEMO-VENUE-CARIBE';age=18;publish=$true},
 @{code='DEMO-EVENT-SMALL-001';name='Encuentro de aforo reducido';category='CULTURE';venue='DEMO-VENUE-MINI';age=0;publish=$true},
 @{code='DEMO-EVENT-TICKETS-001';name='Festival de Musica del Caribe';category='MUSIC';venue='DEMO-VENUE-CARIBE';age=0;publish=$true}
)
foreach($e in $definitions){
 $exists=@(Sql "SELECT event_code FROM events WHERE event_code='$($e.code)'")
 if(-not $exists.Count){
  $event=Api POST '/events' @{eventCode=$e.code;name=$e.name;description='Encuentro cultural y academico con actividades presenciales, artistas invitados y acceso mediante PulsePass.';category=$e.category;eventDate='2028-11-23T20:00:00';minimumAge=$e.age;venueCode=$e.venue} $tokens.ADMIN
  Api POST ('/events/'+$e.code+'/artists/'+$artists[0].id) $null $tokens.ADMIN|Out-Null
  if($e.publish){Api PATCH ('/events/'+$e.code+'/publish') $null $tokens.ADMIN|Out-Null}
  $state.events[$e.code]=@{name=$e.name;initialStatus=if($e.publish){'PUBLISHED'}else{'DRAFT'}};SaveState
 }elseif(-not $state.events.ContainsKey($e.code)){throw ('Unmanaged existing event '+$e.code)}
 # Existing event states are never reset by rerunning the loader.
 Api GET ('/events/'+$e.code) $null $tokens.ADMIN|Out-Null
}
foreach($scenario in @('PAID','CANCELLED','USED','VALIDATION_PAID','USER_B_PAID')){
 if(-not $state.tickets.ContainsKey($scenario)){
  $actor=if($scenario -eq 'USER_B_PAID'){'USER_B'}else{'USER_A'}
  $email=($actors|Where-Object name -eq $actor).email
  $ticket=Api POST '/tickets' @{userEmail=$email;eventCode='DEMO-EVENT-TICKETS-001';type='GENERAL'} $tokens[$actor]
  $state.tickets[$scenario]=@{ticketCode=$ticket.ticketCode;owner=$actor;expectedStatus='PAID'};SaveState
  if($scenario -eq 'CANCELLED'){$ticket=Api PATCH ('/tickets/'+$ticket.ticketCode+'/cancel') $null $tokens[$actor];$state.tickets[$scenario].expectedStatus='CANCELLED'}
  if($scenario -eq 'USED'){$ticket=Api PATCH ('/tickets/'+$ticket.ticketCode+'/use') $null $tokens.STAFF;$state.tickets[$scenario].expectedStatus='USED'}
  SaveState
 }
 $record=$state.tickets[$scenario];$actual=Api GET ('/tickets/'+$record.ticketCode) $null $tokens[$record.owner]
 if($actual.status -ne $record.expectedStatus){throw ('Existing demo ticket state changed; not reset: '+$scenario)}
}
$counts=Sql "SELECT 'users='||count(*) FROM users; SELECT 'venues='||count(*) FROM venues; SELECT 'events='||count(*) FROM events; SELECT 'tickets='||count(*) FROM tickets; SELECT 'bcrypt='||bool_and(password_hash ~ '^\`$2[aby]\`$') FROM user_credentials"
$validation=@{executedAt=(Get-Date).ToString('o');database='pulsepass';port=5433;http=$log;counts=$counts;manifest=$state}
$validation|ConvertTo-Json -Depth 14|Set-Content -Encoding utf8 (Join-Path $LocalStateDirectory ('validation-'+(Get-Date -Format 'yyyyMMdd-HHmmss')+'.json'))
[pscustomobject]@{actors=$state.actors.Count;events=$state.events.Count;tickets=$state.tickets.Count;http=$log.Count;credentialFile=$secretFile;validationFile=(Join-Path $LocalStateDirectory ('validation-'+(Get-Date -Format 'yyyyMMdd-HHmmss')+'.json'))}



