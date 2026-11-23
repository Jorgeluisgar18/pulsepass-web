$ErrorActionPreference='Stop'
$container=(docker inspect pulsepass-postgres|ConvertFrom-Json)[0]
if(-not ($container.NetworkSettings.Ports.'5432/tcp'|Where-Object HostPort -eq '5433')){throw 'Expected PostgreSQL host port 5433'}
$listener=Get-NetTCPConnection -LocalPort 8080 -State Listen|Select-Object -First 1
if(-not $listener){throw 'Backend 8080 listener absent'}
$connections=Get-NetTCPConnection -OwningProcess $listener.OwningProcess -State Established
if(-not ($connections|Where-Object {$_.RemotePort -eq 5433}) -or ($connections|Where-Object {$_.RemotePort -eq 5434})){throw 'Backend database socket isolation mismatch'}
$dbUser=($container.Config.Env|Where-Object{$_ -like 'POSTGRES_USER=*'}) -replace '^POSTGRES_USER=',''
$proof=docker exec pulsepass-postgres psql -X -q -v ON_ERROR_STOP=1 -U $dbUser -d pulsepass -Atc "BEGIN READ ONLY; SELECT current_database(); SELECT count(*) FROM pg_stat_activity WHERE datname='pulsepass' AND application_name='PostgreSQL JDBC Driver'; COMMIT;"
if($LASTEXITCODE -ne 0 -or $proof[0] -ne 'pulsepass' -or [int]$proof[1] -lt 1){throw 'Main database JDBC preflight failed'}
