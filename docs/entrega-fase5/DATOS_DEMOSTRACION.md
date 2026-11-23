# Datos persistentes de demostración

Preparación realizada el 23 de noviembre de 2026 sobre `pulsepass`, contenedor `pulsepass-postgres`, host `5433`. Backend `8080`; frontend Preview `4173`. No se reiniciaron servicios ni se ejecutó el seed E2E.

## Procedimiento reproducible

Ejecutar desde la raíz frontend con PowerShell 7:

```powershell
./docs/entrega-fase5/scripts/Prepare-Demo.ps1
```

El script comprueba el contenedor, puerto, sockets del backend y nombre de base mediante una transacción guardada. Registra cuentas por `POST /api/users`, preserva credenciales BCrypt generadas por el backend y añade STAFF/ADMIN localmente solo al actor recién creado. Las cuentas privilegiadas conservan también USER asignado por el registro público; los controles efectivos de la interfaz priorizan STAFF/ADMIN para ocultar compras.

Los registros existentes no se sobrescriben: una identidad no gestionada o un estado de ticket modificado detiene la ejecución. Una segunda ejecución conservó 5 usuarios, 4 sedes, 8 eventos y 5 tickets sin duplicarlos. Las consultas de negocio y autenticación se repiten.

## Actores y credenciales locales

| Actor | Username | Rol esperado |
| --- | --- | --- |
| USER_A | demo_user_a | USER |
| USER_B | demo_user_b | USER |
| STAFF | demo_staff | USER y STAFF |
| ADMIN | demo_admin | USER y ADMIN |
| USER_RESTRICCION_EDAD | demo_underage | USER |

Cada actor tiene una contraseña independiente, cifrada con DPAPI para el propietario de Windows en `%LOCALAPPDATA%/PulsePass/demo-delivery/credentials.dpapi.json`. Ese archivo está fuera del repositorio. No contiene credenciales en texto plano y nunca debe versionarse. El propietario puede descifrar el valor del actor con `ConvertTo-SecureString` en su sesión local. El manifiesto local contiene usernames, emails sintéticos, códigos y estados esperados; no incluye contraseñas ni JWT.

## Sedes y eventos estables

Los nombres visibles se normalizaron por instrucción del propietario para evitar etiquetas técnicas; los códigos internos mantienen DEMO/QA para trazabilidad. Todos los establecimientos y eventos fueron creados para esta entrega académica y no representan anuncios comerciales reales.

| Código de sede | Nombre visible | Ciudad | Capacidad |
| --- | --- | --- | --- |
| DEMO-VENUE-CARIBE | Centro de Eventos Caribe | Santa Marta | 500 |
| DEMO-VENUE-CIENAGA | Auditorio Cultural Cienaga | Cienaga | 200 |
| DEMO-VENUE-ARENA | Arena PulsePass | Barranquilla | 1000 |
| DEMO-VENUE-MINI | Mini Auditorio Caribe | Santa Marta | 2 |

Las ocho fechas iniciales son `2028-11-23T20:00:00`.

| Código | Nombre visible | Categoría | Estado inicial |
| --- | --- | --- | --- |
| DEMO-EVENT-MUSIC-001 | Festival Caribe PulsePass | MUSIC | PUBLISHED |
| DEMO-EVENT-TECH-001 | Encuentro de Innovacion | TECHNOLOGY | PUBLISHED |
| DEMO-EVENT-CULTURE-001 | Festival Cultural Magdalena | CULTURE | PUBLISHED |
| DEMO-EVENT-DRAFT-001 | Encuentro Universitario | EDUCATION | DRAFT |
| DEMO-EVENT-PUBLISH-001 | Noche Cultural del Caribe | ENTERTAINMENT | DRAFT |
| DEMO-EVENT-AGE-001 | Noche Tropical mayores de 18 | MUSIC | PUBLISHED |
| DEMO-EVENT-SMALL-001 | Encuentro de aforo reducido | CULTURE | PUBLISHED |
| DEMO-EVENT-TICKETS-001 | Festival de Musica del Caribe | MUSIC | PUBLISHED |

Los ocho eventos tienen el artista activo Solar Beat asociado. Se reutilizaron los cinco artistas de Flyway; no se duplicaron. El evento AGE requiere 18 años. SMALL utiliza capacidad 2. Los eventos DRAFT no se restablecen silenciosamente si el profesor los publica.

## Tickets estables

Todos se obtuvieron por endpoints de negocio, sobre DEMO-EVENT-TICKETS-001, tipo GENERAL:

| Escenario | Propietario | Estado | Código |
| --- | --- | --- | --- |
| PAID | USER_A | PAID | TKT-B248C79B-1472-464B-AE62-84448EB263F0 |
| CANCELLED | USER_A | CANCELLED | TKT-CDE9F407-C9EA-4787-9B42-9ADF42B2D827 |
| USED | USER_A | USED | TKT-E523FA90-A055-4883-A426-D1607BDACF89 |
| VALIDATION_PAID | USER_A | PAID | TKT-9188EF1F-0E36-47D2-BA5F-A51FE8716DC7 |
| USER_B_PAID | USER_B | PAID | TKT-1420D0CF-7241-420C-9E9C-6A95C78E0B3A |

VALIDATION_PAID permanece reservado para validar en vivo. No se consumió durante QA. Usarlo o cancelarlo cambia permanentemente el registro; el cargador no lo restaura.

## Pruebas QA separadas

`Verify-QaBusinessFlows.ps1` crea registros nuevos `QA-<fecha-hora>-*`. La ejecución `20261123133701` produjo 3 eventos y 4 tickets. Resultado: 30 respuestas con HTTP esperado, cero divergencias. Incluyó propiedad ajena 403 sin mutación, uso repetido 409, cancelación legítima, cancelación de USED 409, edad insuficiente 409, aforo completo 409/SOLD_OUT y duplicados de publicación/artista 409.

`Verify-BrowserFlows.cjs` usa Chrome real y las credenciales DPAPI locales. Configurar `PWSH` con la ruta de PowerShell 7 (opcional si `pwsh.exe` está en PATH). El módulo se resuelve con `require("playwright")` o mediante `PULSEPASS_PLAYWRIGHT_MODULE`, que debe apuntar a una instalación existente. No se instala ninguna dependencia. Ejemplo local: `$env:PULSEPASS_PLAYWRIGHT_MODULE = "C:/ruta/existente/node_modules/playwright"`; `node docs/entrega-fase5/scripts/Verify-BrowserFlows.cjs`. La ejecución `20261123183844` creó `QA-UI-20261123183844` y 2 tickets mediante UI: creación, asociación, publicación, dos compras, cancelación y validación STAFF. Registró 7 mutaciones HTTP esperadas, 11 capturas y cero errores JavaScript. La repetición del uso 409 se comprobó por API; la interfaz retira esa acción al detectar USED.

Los archivos locales `qa-*.json`, `ui-*.json`, `validation-*.json` conservan los resultados sanitizados. Las capturas están en las carpetas `03-user`, `04-staff` y `05-admin` de evidencias. Los eventos QA tienen códigos separados de los estables. No se eliminan automáticamente al terminar las pruebas.
