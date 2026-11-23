const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const {chromium}=require(process.env.PULSEPASS_PLAYWRIGHT_MODULE||'playwright');
const root='docs/entrega-fase5/evidencias/09-conformidad-visual',base='http://127.0.0.1:4173';
const state=path.join(process.env.LOCALAPPDATA,'PulsePass/demo-delivery'),manifest=JSON.parse(fs.readFileSync(path.join(state,'manifest.json'),'utf8').replace(/^\uFEFF/,''));
const results={executedAt:new Date().toISOString(),build:{javascript:'index-CK6k0KnD.js',stylesheet:'index-CoS_dT1W.css'},captures:[],errors:[],blockedWrites:[],realBusinessWrites:0};
function password(actor){return execFileSync(process.env.PWSH||'pwsh.exe',['-NoProfile','-NonInteractive','-Command',`$x=Get-Content -Raw '${state.replace(/'/g,"''")}/credentials.dpapi.json'|ConvertFrom-Json -AsHashtable;$s=ConvertTo-SecureString $x['${actor}'];$p=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($s);try{[Runtime.InteropServices.Marshal]::PtrToStringBSTR($p)}finally{[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($p)}`],{encoding:'utf8',windowsHide:true}).trim()}
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
for(const actor of ['PUBLIC','USER_A','STAFF','ADMIN']){
 const c=await browser.newContext({viewport:{width:1280,height:1000}}),p=await c.newPage();p.setDefaultTimeout(10000);p.on('pageerror',e=>results.errors.push({actor,message:e.message}));
 await p.route('**/api/**',async r=>{if(!['GET','HEAD'].includes(r.request().method())&&new URL(r.request().url()).pathname!='/api/auth/login'){results.blockedWrites.push(new URL(r.request().url()).pathname);return r.abort('blockedbyclient')}return r.continue()});
 if(actor!=='PUBLIC'){await p.goto(base+'/login');await p.getByLabel('Usuario o correo electrónico',{exact:true}).fill(manifest.actors[actor].username);await p.getByLabel('Contraseña',{exact:true}).fill(password(actor));await p.getByRole('button',{name:'Ingresar',exact:true}).click();await p.waitForURL(u=>u.pathname!='/login')}
 async function shot(id,route,setup=null,mock=false,width=1280){await p.setViewportSize({width,height:1000});await p.goto(base+route,{waitUntil:'networkidle'});if(setup)await setup();await p.waitForTimeout(350);const file=root+'/'+id+'.png';await p.screenshot({path:file,fullPage:true});results.captures.push({id,route,actor,viewport:{width,height:1000},api:mock?'controlled browser mock':'real read-only',file,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)})}
 if(actor==='PUBLIC'){
 for(const [id,route]of [['01-main','/'],['02-catalogo','/eventos'],['05-artistas','/artistas'],['06-detalle-artista','/artistas/1'],['07-sedes','/sedes'],['08-detalle-sede','/sedes/DEMO-VENUE-CARIBE'],['09-login','/login'],['10-registro','/registro'],['23-404','/no-existe']])await shot(id,route);
 await shot('26-menu-cerrado','/',null,false,390);await shot('27-menu-abierto','/',async()=>{await p.getByRole('button',{name:/Abrir menú|Abrir navegación|Menú/i}).click()},false,390);await shot('28-inicio-movil','/',null,false,390);
 for(const [id,route]of [['31-catalogo-oscuro','/eventos']])await shot(id,route,async()=>{await p.evaluate(()=>document.documentElement.classList.add('dark'))});
 await p.route('**/api/events/published',r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));await shot('24-estado-vacio','/eventos',null,true);
 await p.unroute('**/api/events/published');await p.route('**/api/events/published',r=>r.fulfill({status:500,contentType:'application/json',body:JSON.stringify({timestamp:new Date().toISOString(),error:'Internal Server Error',status:500,message:'No pudimos conectar con el servidor.'})}));await shot('24-estado-error','/eventos',async()=>{await p.getByRole('button',{name:'Reintentar',exact:true}).waitFor({timeout:20000})},true);
 }
 if(actor==='USER_A'){
 await shot('32-detalle-oscuro','/eventos/DEMO-EVENT-MUSIC-001',async()=>{await p.evaluate(()=>document.documentElement.classList.add('dark'))});
 await shot('03-detalle-evento','/eventos/DEMO-EVENT-MUSIC-001');await shot('04-modal-compra','/eventos/DEMO-EVENT-MUSIC-001',async()=>{await p.getByRole('button',{name:'Comprar entrada',exact:true}).filter({visible:true}).first().click()});
 await shot('11-cuenta','/cuenta');await shot('12-mis-tickets','/mis-tickets');const code=manifest.tickets.PAID.ticketCode;
 await shot('13-modal-cancelar','/mis-tickets/'+code,async()=>{await p.getByRole('button',{name:'Cancelar ticket '+code,exact:true}).click()});await shot('14-detalle-ticket','/mis-tickets/'+code);await shot('15-confirmacion','/compra/confirmacion/'+code);
 await shot('29-evento-movil','/eventos/DEMO-EVENT-MUSIC-001',null,false,390);
 await p.route('**/api/tickets/*/cancel',r=>r.fulfill({status:409,contentType:'application/json',body:JSON.stringify({timestamp:new Date().toISOString(),error:'Conflict',status:409,message:'El ticket no puede cancelarse en su estado actual.'})}));await shot('13-modal-cancelar-409','/mis-tickets/'+code,async()=>{await p.getByRole('button',{name:'Cancelar ticket '+code,exact:true}).click();await p.getByRole('button',{name:'Confirmar cancelación',exact:true}).click();await p.getByRole('alert').waitFor()},true);
 }
 if(actor==='STAFF'){
 const code=manifest.tickets.VALIDATION_PAID.ticketCode;
 const search=async()=>{await p.getByLabel('Código de ticket',{exact:true}).fill(code);await p.getByLabel('Código de ticket',{exact:true}).press('Enter');await p.getByRole('button',{name:'Marcar como usado',exact:true}).waitFor()};
 await shot('16-validacion','/staff/validacion',search);await shot('19-pagados','/staff/eventos/DEMO-EVENT-TICKETS-001/tickets');await shot('30-pagados-movil','/staff/eventos/DEMO-EVENT-TICKETS-001/tickets',null,false,390);
 let mockedUsed=null;await p.route('**/api/tickets/'+code,async r=>{if(mockedUsed)return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(mockedUsed)});return r.continue()});await p.route('**/api/tickets/*/use',async r=>{const t=await(await fetch('http://127.0.0.1:8080/api/tickets/'+code,{headers:{Authorization:r.request().headers().authorization}})).json();mockedUsed={...t,status:'USED'};return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(mockedUsed)})});
 await shot('17-validacion-exito','/staff/validacion',async()=>{await search();await p.getByRole('button',{name:'Marcar como usado',exact:true}).click();await p.getByText('Ticket marcado como usado.',{exact:true}).waitFor()},true);
 mockedUsed=null;await p.unroute('**/api/tickets/*/use');await p.route('**/api/tickets/*/use',r=>r.fulfill({status:409,contentType:'application/json',body:JSON.stringify({timestamp:new Date().toISOString(),error:'Conflict',status:409,message:'El ticket ya fue utilizado.'})}));await shot('18-validacion-409','/staff/validacion',async()=>{await search();await p.getByRole('button',{name:'Marcar como usado',exact:true}).click();await p.getByRole('alert').waitFor()},true);
 }
 if(actor==='ADMIN'){await shot('20-admin-eventos','/admin/eventos');await shot('21-admin-crear','/admin/eventos/nuevo');await shot('22-admin-gestion','/admin/eventos/DEMO-EVENT-DRAFT-001')}
 await c.close();}
} catch(e){results.failure=e.message;process.exitCode=1}finally{await browser.close();fs.writeFileSync(root+'/browser-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify({captures:results.captures.length,failure:results.failure||null,errors:results.errors.length,blockedWrites:results.blockedWrites.length}))}})();
