param([string]$LocalStateDirectory="$env:LOCALAPPDATA\PulsePass\demo-delivery")
$ErrorActionPreference='Stop'
& (Join-Path $PSScriptRoot 'Assert-MainDatasource.ps1')
$api='http://127.0.0.1:8080/api'
$secrets=Get-Content (Join-Path $LocalStateDirectory 'credentials.dpapi.json') -Raw|ConvertFrom-Json -AsHashtable
$manifest=Get-Content (Join-Path $LocalStateDirectory 'manifest.json') -Raw|ConvertFrom-Json -AsHashtable
$run=Get-Date -Format 'yyyyMMddHHmmss';$evidence=@{run=$run;http=[System.Collections.Generic.List[object]]::new();checks=@();events=@();tickets=@()}
function Call([string]$method,[string]$path,$body,[string]$token,[int]$expected=200){
 $args=@{Uri=($api+$path);Method=$method;ContentType='application/json';SkipHttpErrorCheck=$true;Headers=@{}}
 if($token){$args.Headers.Authorization='Bearer '+$token};if($null -ne $body){$args.Body=$body|ConvertTo-Json -Compress}
 $r=Invoke-WebRequest @args
 $evidence.http.Add(@{method=$method;path=$path;expected=$expected;actual=[int]$r.StatusCode;passed=([int]$r.StatusCode -eq $expected)})
 if([int]$r.StatusCode -ne $expected){throw ('Unexpected HTTP '+$r.StatusCode+' at '+$path)}
 if($r.Content){return $r.Content|ConvertFrom-Json}
}
$tokens=@{}
foreach($actor in @('ADMIN','STAFF','USER_A','USER_B','USER_RESTRICCION_EDAD')){
 $sec=ConvertTo-SecureString $secrets[$actor];$ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
 try{$password=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)}finally{[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)}
 $auth=Call POST '/auth/login' @{identifier=$manifest.actors[$actor].username;password=$password} '';$password=$null;$tokens[$actor]=$auth.accessToken
}
function Event([string]$suffix,[string]$venue,[int]$age){
 $code="QA-$run-$suffix"
 $event=Call POST '/events' @{eventCode=$code;name="QA $run $suffix";description='Isolated QA run; not a stable demonstration record.';category='MUSIC';eventDate='2028-11-24T20:00:00';minimumAge=$age;venueCode=$venue} $tokens.ADMIN 201
 $evidence.events+= $code
 return $code
}
function Purchase([string]$event,[string]$actor='USER_A',[int]$expected=201){
 $ticket=Call POST '/tickets' @{userEmail=$manifest.actors[$actor].email;eventCode=$event;type='GENERAL'} $tokens[$actor] $expected
 if($expected -eq 201){$evidence.tickets+=$ticket.ticketCode};return $ticket
}
try{
 $code=Event 'FLOW' 'DEMO-VENUE-CARIBE' 0
 $artists=Call GET '/artists/active' $null ''
 Call POST "/events/$code/artists/$($artists[0].id)" $null $tokens.ADMIN|Out-Null
 Call POST "/events/$code/artists/$($artists[0].id)" $null $tokens.ADMIN 409|Out-Null
 Call PATCH "/events/$code/publish" $null $tokens.ADMIN|Out-Null
 Call PATCH "/events/$code/publish" $null $tokens.ADMIN 409|Out-Null
 $ticket=Purchase $code
 Call GET "/tickets/$($ticket.ticketCode)" $null $tokens.USER_B 403|Out-Null
 Call PATCH "/tickets/$($ticket.ticketCode)/cancel" $null $tokens.USER_B 403|Out-Null
 $unchanged=Call GET "/tickets/$($ticket.ticketCode)" $null $tokens.USER_A
 if($unchanged.status -ne 'PAID'){throw 'Ownership denial mutated the ticket'}
 $evidence.checks+=@{name='Foreign read and cancellation denied without mutation';passed=$true;before='PAID';after=$unchanged.status}
 Call PATCH "/tickets/$($ticket.ticketCode)/use" $null $tokens.STAFF|Out-Null
 Call PATCH "/tickets/$($ticket.ticketCode)/use" $null $tokens.STAFF 409|Out-Null
 Call PATCH "/tickets/$($ticket.ticketCode)/cancel" $null $tokens.USER_A 409|Out-Null
 $cancel=Purchase $code
 Call PATCH "/tickets/$($cancel.ticketCode)/cancel" $null $tokens.USER_A|Out-Null
 $after=Call GET "/tickets/$($cancel.ticketCode)" $null $tokens.USER_A
 if($after.status -ne 'CANCELLED'){throw 'Cancellation state mismatch'}
 $evidence.checks+=@{name='Legitimate cancellation';passed=$true;after=$after.status}
 $age=Event 'AGE' 'DEMO-VENUE-CARIBE' 18
 Call PATCH "/events/$age/publish" $null $tokens.ADMIN|Out-Null
 Purchase $age 'USER_RESTRICCION_EDAD' 409|Out-Null
 $small=Event 'CAPACITY' 'DEMO-VENUE-MINI' 0
 Call PATCH "/events/$small/publish" $null $tokens.ADMIN|Out-Null
 Purchase $small|Out-Null;Purchase $small 'USER_B'|Out-Null
 Purchase $small 'USER_A' 409|Out-Null
 $sold=Call GET "/events/$small" $null $tokens.ADMIN
 if($sold.status -ne 'SOLD_OUT'){throw 'Capacity state mismatch'}
 $evidence.checks+=@{name='Small capacity enforced';passed=$true;after=$sold.status}
}finally{
 $evidence|ConvertTo-Json -Depth 12|Set-Content (Join-Path $LocalStateDirectory "qa-$run.json") -Encoding utf8
}
[pscustomobject]@{run=$run;http=$evidence.http.Count;failed=@($evidence.http|Where-Object {-not $_.passed}).Count;events=$evidence.events.Count;tickets=$evidence.tickets.Count;evidenceFile=(Join-Path $LocalStateDirectory "qa-$run.json")}

