# Matriz de cumplimiento del PRD

Fecha: 23 de noviembre de 2026. Fuente: `PulsePass_PRD_Original.pdf`, 63 páginas. Referencia local: main `11d18f5`.

Estados permitidos: CUMPLE, PARCIAL, NO CUMPLE, NO VERIFICADO, NO APLICA. Evidencia A = código inspeccionado; B = prueba automatizada; C = navegador con API real; D = inspección visual. La implementación por sí sola no concede CUMPLE. Bloque 42 verificó la ejecución actual:203/203 Vitest, lint y build correctos. Los resultados196/196,191/191 y161/161 se conservan como históricos. C y D actuales se consolidan en los manifiestos de evidencias yAUDITORIA_VISUAL:80 recorridos públicos,7 por roles y6 controles focalizados. No se deducen de pruebasMSW; laequivalencia completa32referencias sigue pendiente. Las rutas de evidencia sugeridas no significan que un archivo ya exista.

## Requisitos funcionales oficiales (sección 7)

| ID | Sección/página | Criterio oficial | Código/prueba relacionada | Evidencia y estado | Brecha / acción |
|---|---|---|---|---|---|
| FR-FE-EVT-001 | 7 / 8 | Cartelera publicada y vacío | src/funcionalidades/eventos/; src/test/pages/CatalogoEventos.test.tsx; pages/DetalleEvento.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-EVT-002 | 7 / 8 | Filtros texto/categoría persistidos en URL | src/funcionalidades/eventos/; src/test/pages/CatalogoEventos.test.tsx; pages/DetalleEvento.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-EVT-003 | 7 / 8 | Detalle evento, sede, artistas y 404 | src/funcionalidades/eventos/; src/test/pages/CatalogoEventos.test.tsx; pages/DetalleEvento.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-EVT-004 | 7 / 8 | Eventos por artista | src/funcionalidades/eventos/; src/test/pages/CatalogoEventos.test.tsx; pages/DetalleEvento.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-EVT-005 | 7 / 8 | Badge y compra solo PUBLISHED | src/funcionalidades/eventos/; src/test/pages/CatalogoEventos.test.tsx; pages/DetalleEvento.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-ART-001 | 7 / 8 | Artistas activos | src/funcionalidades/artistas/; src/test/pages/ListaArtistas.test.tsx; pages/DetalleArtista.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-ART-002 | 7 / 8 | Detalle y eventos asociados; 404 | src/funcionalidades/artistas/; src/test/pages/ListaArtistas.test.tsx; pages/DetalleArtista.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-ART-003 | 7 / 8 | Resolver artista por nombre | src/funcionalidades/artistas/; src/test/pages/ListaArtistas.test.tsx; pages/DetalleArtista.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-VEN-001 | 7 / 8 | Sedes activas con ciudad/capacidad | src/funcionalidades/sedes/; src/test/pages/ListaSedes.test.tsx; pages/DetalleSede.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-VEN-002 | 7 / 8 | Detalle sede y 404 | src/funcionalidades/sedes/; src/test/pages/ListaSedes.test.tsx; pages/DetalleSede.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-AUTH-001 | 7 / 9 | Registro201 a login y duplicado seguro | src/funcionalidades/auth/; src/test/funcionalidades/auth/Auth.test.tsx; funcionalidades/auth/PerfilCuenta.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-AUTH-002 | 7 / 9 | Login carga identidad y retorna origen | src/funcionalidades/auth/; src/test/funcionalidades/auth/Auth.test.tsx; funcionalidades/auth/PerfilCuenta.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-AUTH-003 | 7 / 9 | Credenciales inválidas genéricas | src/funcionalidades/auth/; src/test/funcionalidades/auth/Auth.test.tsx; funcionalidades/auth/PerfilCuenta.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-AUTH-004 | 7 / 9 | Restauración al recargar | src/funcionalidades/auth/; src/test/funcionalidades/auth/Auth.test.tsx; funcionalidades/auth/PerfilCuenta.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-AUTH-005 | 7 / 9 | 401 expira y redirige | src/funcionalidades/auth/; src/test/funcionalidades/auth/Auth.test.tsx; funcionalidades/auth/PerfilCuenta.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-AUTH-006 | 7 / 9 | Cerrar sesión elimina token/caché | src/funcionalidades/auth/; src/test/funcionalidades/auth/Auth.test.tsx; funcionalidades/auth/PerfilCuenta.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-AUTH-007 | 7 / 9 | Cuenta propia y perfil | src/funcionalidades/auth/; src/test/funcionalidades/auth/Auth.test.tsx; funcionalidades/auth/PerfilCuenta.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-TKT-001 | 7 / 9 | Compra con email propio y confirmación201/409 | src/funcionalidades/tickets/; src/test/funcionalidades/tickets/TicketsFlows.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-TKT-002 | 7 / 9 | Anónimo a login y retorno | src/funcionalidades/tickets/; src/test/funcionalidades/tickets/TicketsFlows.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-TKT-003 | 7 / 9 | Mis tickets propios y filtros | src/funcionalidades/tickets/; src/test/funcionalidades/tickets/TicketsFlows.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-TKT-004 | 7 / 9 | Detalle con privacidad403/404 | src/funcionalidades/tickets/; src/test/funcionalidades/tickets/TicketsFlows.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-TKT-005 | 7 / 9 | Cancelar con confirmación solo PAID y200/409 | src/funcionalidades/tickets/; src/test/funcionalidades/tickets/TicketsFlows.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-STF-001 | 7 / 9 | Buscar y usar ticket200; repetición409 | src/funcionalidades/tickets/; src/test/funcionalidades/staff/StaffFlows.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-STF-002 | 7 / 9 | Tickets pagados por evento | src/funcionalidades/tickets/; src/test/funcionalidades/staff/StaffFlows.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-ADM-001 | 7 / 10 | Crear201, details400 y duplicado409 | src/funcionalidades/administracion/; src/test/funcionalidades/admin/AdminFlows.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-ADM-002 | 7 / 10 | Sede seleccionada de API | src/funcionalidades/administracion/; src/test/funcionalidades/admin/AdminFlows.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-ADM-003 | 7 / 10 | Buscar/gestionar evento por código | src/funcionalidades/administracion/; src/test/funcionalidades/admin/AdminFlows.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-ADM-004 | 7 / 10 | Publicar con confirmación200/409 | src/funcionalidades/administracion/; src/test/funcionalidades/admin/AdminFlows.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-ADM-005 | 7 / 10 | Asociar artista200/duplicado409 | src/funcionalidades/administracion/; src/test/funcionalidades/admin/AdminFlows.test.tsx | A+B+C; CUMPLE | Criterio funcional respaldado por pruebas y alcanceUI de tablaAPI; APIreal para recorrido feliz según11-rutas-api/ui-business. Errores simulados se identifican comoB, sin declarar todas variantesE2E. |
| FR-FE-GEN-001 | 7 / 10 | Navbar por rol y menú móvil | src/funcionalidades/transversal/; src/test/layouts/Navbar.test.tsx; router/Router.test.tsx | A+B+C; CUMPLE | Navbar roles y teclado verificados porGEN003/GEN004; erroresseguros porErrorPagina/Router y rutasreales403/404 en11-rutas-api. |
| FR-FE-GEN-002 | 7 / 10 | 403/404/errorElement | src/funcionalidades/transversal/; src/test/layouts/Navbar.test.tsx; router/Router.test.tsx | A+B+C; CUMPLE | Navbar roles y teclado verificados porGEN003/GEN004; erroresseguros porErrorPagina/Router y rutasreales403/404 en11-rutas-api. |
| FR-FE-GEN-003 | 7 / 10 | Notificaciones aria-live | `src/componentes/Aviso.tsx`; `src/test/componentes/Aviso.test.tsx`; `src/test/funcionalidades/tickets/TicketsFlows.test.tsx` | A+B; CUMPLE | Avisos éxito/error/info/advertencia con roles y variantes dark; 409 permanece dentro del modal con alert. Prueba focalizada32/32; suites203/203. |
| FR-FE-GEN-004 | 7 / 10 | Oscuro sistema y alternancia | `src/lib/tema.ts`; `src/layouts/Navbar.tsx`; `src/main.tsx`; `src/test/layouts/Navbar.test.tsx` | A+B+C; CUMPLE | Sistema claro/oscuro, selección manual persistida, precedencia manual y actualización del sistema sin preferencia manual. Navegador confirmó Inicio claro/oscuro y persistencia al navegar a Cartelera. Capturas en evidencias/12-notificaciones-tema. |

## Rutas (8.1–8.4, páginas 10–12)

Cada fila exige acceso, navegación, datos y lazy salvo Inicio. Código A: `src/router.tsx:15` y `src/lib/rutas.ts`; C/D pendientes.

| ID local | Ruta | Página / acceso | Estado | Brecha / acción |
|---|---|---|---|---|
| RUTA-01 | `/` | Inicio P | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-02 | `/eventos` | CatalogoEventos P | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-03 | `/eventos/:eventCode` | DetalleEvento P publicado | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-04 | `/artistas` | ListaArtistas P | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-05 | `/artistas/:id` | DetalleArtista P | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-06 | `/sedes` | ListaSedes P | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-07 | `/sedes/:code` | DetalleSede P | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-08 | `/login` | Login P solo anónimo | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-09 | `/registro` | Registro P solo anónimo | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-10 | `/cuenta` | Cuenta autenticado | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-11 | `/mis-tickets` | MisTickets USER | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-12 | `/mis-tickets/:ticketCode` | DetalleTicket USER | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-13 | `/compra/confirmacion/:ticketCode` | ConfirmacionCompra USER | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-14 | `/staff/validacion` | ValidacionIngreso STAFF/ADMIN | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-15 | `/staff/eventos/:eventCode/tickets` | TicketsPagadosEvento STAFF/ADMIN | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-16 | `/admin/eventos` | AdminEventos ADMIN | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-17 | `/admin/eventos/nuevo` | AdminCrearEvento ADMIN | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-18 | `/admin/eventos/:eventCode` | AdminGestionEvento ADMIN | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-19 | `/403` | SinPermisos P | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |
| RUTA-20 | `*` | NoEncontrada P | CUMPLE | A:router y lazy; C:11-rutas-api/routes-api-results.json registra esta categoría entre20recorridos con rol,h1,URL,HTTP yPNG. Las condiciones de error detalladas se evalúan por criterio separado. |

## Contratos: 23 operaciones de tabla 10.3 (páginas 47–48)

Los 23 renglones incluyen POST users repetido en A3; son 20 operaciones F3 y tres referencias F4. Toda respuesta debe validar Zod (10.1–10.2, páginas46–47).

| ID local | Operación | Página / hook esperado | Estado | Evidencia / acción |
|---|---|---|---|---|
| API-01 | `/api/` GET venues/{code} | DetalleSede/useSede | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-02 | `/api/` GET venues/active | ListaSedes y AdminCrearEvento | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-03 | `/api/` POST events | AdminCrearEvento | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-04 | `/api/` GET events/{eventCode} | DetalleEvento/AdminEventos/AdminGestion | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-05 | `/api/` GET events/published | Inicio/Catalogo | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-06 | `/api/` PATCH events/{eventCode}/publish | AdminGestion | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-07 | `/api/` POST events/{eventCode}/artists/{artistId} | AdminGestion | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-08 | `/api/` GET events/by-artist?stageName= | Catalogo/DetalleArtista | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-09 | `/api/` GET artists/{id} | DetalleArtista | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-10 | `/api/` GET artists/by-stage-name?stageName= | Catalogo/DetalleArtista | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-11 | `/api/` GET artists/active | Inicio/ListaArtistas/AdminGestion | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-12 | `/api/` POST users | Registro | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-13 | `/api/` GET users/by-email?email= | Cuenta/email propio inicial | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-14 | `/api/` GET users/by-username?username= | Cuenta/acción username propio | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-15 | `/api/` POST tickets | DetalleEvento | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-16 | `/api/` GET tickets/{ticketCode} | DetalleTicket/Confirmacion/Validacion | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-17 | `/api/` GET tickets/by-user?email= | MisTickets | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-18 | `/api/` GET events/{eventCode}/tickets/paid | TicketsPagadosEvento | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-19 | `/api/` PATCH tickets/{ticketCode}/cancel | MisTickets/DetalleTicket | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-20 | `/api/` PATCH tickets/{ticketCode}/use | Validacion/TicketsPagados | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-21 | `/api/` POST auth/login | Login | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-22 | `/api/` GET auth/me | AuthContext/Cuenta | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |
| API-23 | `/api/` POST users | Registro F4 | CUMPLE | A+B:correlaciónhook/acción debajo; C:11-rutas-api/routes-api-results.json yui-business-results.json cuando aplica. AlcanzabilidadUI demostrada; no confundircada estado con éxito API. |

## Errores y estados (13, páginas50–51; 9.20, página46)

| ID local | Criterio | Evidencia asociada | Estado | Acción pendiente |
|---|---|---|---|---|
| UI-RED | Fallo fetch: mensaje seguro y reintento | src/lib/http.ts; componentes; suites de flujos | PARCIAL | Consolidar C, B y comprobación temporal/accesible específica. |
| UI-400 | details a campos o aviso general | src/lib/http.ts; componentes; suites de flujos | PARCIAL | Consolidar C, B y comprobación temporal/accesible específica. |
| UI-401 | Login genérico; otras rutas limpia sesión/caché y redirige con aviso | src/lib/http.ts; componentes; suites de flujos | PARCIAL | Consolidar C, B y comprobación temporal/accesible específica. |
| UI-403 | Página en cargas completas; aviso en acciones | src/lib/http.ts; componentes; suites de flujos | PARCIAL | Consolidar C, B y comprobación temporal/accesible específica. |
| UI-404 | No disponible/no encontrada según contexto y privacidad | src/lib/http.ts; componentes; suites de flujos | PARCIAL | Consolidar C, B y comprobación temporal/accesible específica. |
| UI-409 | Mensaje backend como texto en modal/formulario; no errorElement | src/lib/http.ts; componentes; suites de flujos | PARCIAL | Consolidar C, B y comprobación temporal/accesible específica. |
| UI-500 | Mensaje inesperado sin detalles | src/lib/http.ts; componentes; suites de flujos | PARCIAL | Consolidar C, B y comprobación temporal/accesible específica. |
| UI-LOAD | Esqueleto aria-busy | src/lib/http.ts; componentes; suites de flujos | PARCIAL | Consolidar C, B y comprobación temporal/accesible específica. |
| UI-EMPTY | Mensaje, icono y acción sugerida | src/lib/http.ts; componentes; suites de flujos | PARCIAL | Consolidar C, B y comprobación temporal/accesible específica. |
| UI-SUCCESS | Aviso aria-live polite que desaparece4s | src/lib/http.ts; componentes; suites de flujos | PARCIAL | Consolidar C, B y comprobación temporal/accesible específica. |
| UI-MUTERR | Error persistente y aria-describedby por campo | src/lib/http.ts; componentes; suites de flujos | PARCIAL | Consolidar C, B y comprobación temporal/accesible específica. |

## Casos mínimos oficiales: 50 criterios (sección21, páginas56–57)

Las referencias se asignan por comportamiento leído, no por numeración local AUTH. B significa que la prueba existe y la suite global actual fue comunicada aprobada; los casos parciales no quedan aprobados solamente por ese total. C/D se registran separadamente en PRUEBAS_FUNCIONALES y AUDITORIA_VISUAL.

| ID oficial | Página | Comportamiento | Prueba archivo:línea (relativa a src/test/) | Estado | Observación |
|---|---|---|---|---|---|
| TEST-FE-LIB-001 | 56 | Bearer | `lib/http.test.ts:111` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-LIB-002 | 56 | ErrorResponse a ApiError/details | `lib/http.test.ts:47` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-LIB-003 | 56 | Error inválido genérico | `lib/http.test.ts:78` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-LIB-004 | 56 | 401 logout handler | `lib/http.test.ts:133` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-LIB-005 | 56 | PrecioCOP250000 | `componentes/PrecioCOP.test.tsx:6` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-AUTH-001 | 56 | Login y retorno desde | `funcionalidades/auth/Auth.test.tsx:85 y :434` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-AUTH-002 | 56 | Login401 genérico | `funcionalidades/auth/Auth.test.tsx:124` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-AUTH-003 | 56 | Login vacío cero HTTP | `funcionalidades/auth/Auth.test.tsx:854` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-AUTH-004 | 56 | Contraseña corta cero HTTP | `funcionalidades/auth/Auth.test.tsx:923` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-AUTH-005 | 56 | Registro201 a login | `funcionalidades/auth/Auth.test.tsx:1061` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-AUTH-006 | 56 | Registro409 seguro | `funcionalidades/auth/Auth.test.tsx:1021` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-AUTH-007 | 56 | Anónimo guarda desde | `funcionalidades/auth/Auth.test.tsx:204` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-AUTH-008 | 56 | USER en ADMIN403 | `funcionalidades/auth/Auth.test.tsx:228` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-AUTH-009 | 56 | ADMIN renderiza ADMIN | `funcionalidades/admin/AdminFlows.test.tsx:203` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-AUTH-010 | 56 | Logout limpia token/cache | `funcionalidades/auth/Auth.test.tsx:179` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-AUTH-011 | 56 | Token expirado no restaura | `funcionalidades/auth/AuthNavigation.test.tsx:174` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-EVT-001 | 56 | Lista publicados | `pages/CatalogoEventos.test.tsx:52` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-EVT-002 | 56 | Vacío | `pages/CatalogoEventos.test.tsx:75` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-EVT-003 | 56 | Filtros URL | `pages/CatalogoEventos.test.tsx:92` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-EVT-004 | 56 | Detalle/artistas/sede | `pages/DetalleEvento.test.tsx:47` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-EVT-005 | 56 | Detalle404 | `pages/DetalleEvento.test.tsx:77` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-EVT-006 | 56 | SOLD_OUT deshabilita | `pages/DetalleEvento.test.tsx:108` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-ART-001 | 56 | Lista activos | `pages/ListaArtistas.test.tsx:9` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-ART-002 | 56 | Artista y eventos | `pages/DetalleArtista.test.tsx:35` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-ART-003 | 56 | ID inválido sin API | `pages/DetalleArtista.test.tsx:108` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-VEN-001 | 56 | Lista/detalle/404 | `pages/ListaSedes.test.tsx:30; pages/DetalleSede.test.tsx:26 y :48` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-TKT-001 | 56 | Compra201 confirmación | `funcionalidades/tickets/TicketsFlows.test.tsx:142` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-TKT-002 | 56 | Compra anónima | `funcionalidades/tickets/TicketsFlows.test.tsx:201` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-TKT-003 | 56 | Compra409 modal | `funcionalidades/tickets/TicketsFlows.test.tsx:372` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-TKT-004 | 56 | Email sesión | `funcionalidades/tickets/TicketsFlows.test.tsx:188` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-TKT-005 | 56 | Listado/filtros | `funcionalidades/tickets/TicketsFlows.test.tsx:237` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-TKT-006 | 56 | Vacío | `funcionalidades/tickets/TicketsFlows.test.tsx:388` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-TKT-007 | 56 | PAID cancelar200 | `funcionalidades/tickets/TicketsFlows.test.tsx:306` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-TKT-008 | 56 | Cancelar409 mantiene modal | `funcionalidades/tickets/TicketsFlows.test.tsx:349` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-TKT-009 | 56 | Ajeno403/404 seguro | `funcionalidades/tickets/TicketsFlows.test.tsx:416` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-TKT-010 | 56 | Cancelar oculto para noPAID | `funcionalidades/tickets/TicketsFlows.test.tsx:340` | CUMPLE | B:RESERVED/USED/CANCELLED en listado y detalle; PAID conservado. Ejecución191/191. |
| TEST-FE-STF-001 | 57 | Buscar y usar200 | `funcionalidades/staff/StaffFlows.test.tsx:111` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-STF-002 | 57 | Conflicto409 | `funcionalidades/staff/StaffFlows.test.tsx:163` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-STF-003 | 57 | Inexistente404 | `funcionalidades/staff/StaffFlows.test.tsx:190` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-STF-004 | 57 | Pagados con filas | `funcionalidades/staff/StaffFlows.test.tsx:207` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-ADM-001 | 57 | Vacíos ceroHTTP | `funcionalidades/admin/AdminFlows.test.tsx:203` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-ADM-002 | 57 | Crear201 navegación | `funcionalidades/admin/AdminFlows.test.tsx:203` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-ADM-003 | 57 | 400 detalles campo | `funcionalidades/admin/AdminFlows.test.tsx:276` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-ADM-004 | 57 | Publicar badge | `funcionalidades/admin/AdminFlows.test.tsx:316` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-ADM-005 | 57 | Publicar409 | `funcionalidades/admin/AdminFlows.test.tsx:346` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-ADM-006 | 57 | Asociar y duplicado409 | `funcionalidades/admin/AdminFlows.test.tsx:367` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-GEN-001 | 57 | Ruta404 | `router/Router.test.tsx:8` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-GEN-002 | 57 | Error sin stack | `pages/ErrorPagina.test.tsx:8` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |
| TEST-FE-GEN-003 | 57 | Navbar según rol | `layouts/Navbar.test.tsx:41,76` | CUMPLE | B:visitante y roles en escritorio/móvil; ejecución191/191. |
| TEST-FE-GEN-004 | 57 | Menú teclado | `layouts/Navbar.test.tsx:54` | CUMPLE | B identificado; resultado global191/191 comunicado por coordinación. C no implica B ni viceversa. |

## Etapas y entregables (29, páginas61–62)

| Etapa | Evidencia requerida | Estado | Evidencia / brecha |
|---|---|---|---|
| 1 | Contrato DTO confirmado, tipos y colección Postman | PARCIAL | Código y pruebas disponibles; consolidar evidencia primaria de cada etapa; etapa11 requiere auditoría actual. |
| 2 | Base Vite/React/TS/Tailwind, dev/build | PARCIAL | Código y pruebas disponibles; consolidar evidencia primaria de cada etapa; etapa11 requiere auditoría actual. |
| 3 | UI genérica con pruebas | PARCIAL | Código y pruebas disponibles; consolidar evidencia primaria de cada etapa; etapa11 requiere auditoría actual. |
| 4 | Router/layout/error/lazy | PARCIAL | Código y pruebas disponibles; consolidar evidencia primaria de cada etapa; etapa11 requiere auditoría actual. |
| 5 | HTTP/ApiError/MSW/LIB | PARCIAL | Código y pruebas disponibles; consolidar evidencia primaria de cada etapa; etapa11 requiere auditoría actual. |
| 6 | Catálogo EVT/ART/VEN | PARCIAL | Código y pruebas disponibles; consolidar evidencia primaria de cada etapa; etapa11 requiere auditoría actual. |
| 7 | Auth y guardas AUTH | PARCIAL | Código y pruebas disponibles; consolidar evidencia primaria de cada etapa; etapa11 requiere auditoría actual. |
| 8 | Tickets TKT | PARCIAL | Código y pruebas disponibles; consolidar evidencia primaria de cada etapa; etapa11 requiere auditoría actual. |
| 9 | STAFF STF | PARCIAL | Código y pruebas disponibles; consolidar evidencia primaria de cada etapa; etapa11 requiere auditoría actual. |
| 10 | ADMIN ADM | PARCIAL | Código y pruebas disponibles; consolidar evidencia primaria de cada etapa; etapa11 requiere auditoría actual. |
| 11 | Accesibilidad/responsive/oscuro/Lighthouse/README | PARCIAL | Código y pruebas disponibles; consolidar evidencia primaria de cada etapa; etapa11 requiere auditoría actual. |

## Definition of Ready (30.1, página62)

| ID local | Criterio | Estado | Evidencia / brecha |
|---|---|---|---|
| DOR-01 | API F3/F4 local8080 | CUMPLE | Evidencias public-browser-results.json y qa-business-results.json: respuestas reales de los endpoints existentes. |
| DOR-02 | Usuarios demo USER/STAFF/ADMIN | CUMPLE | roles-readonly-results.json: siete páginas autenticadas de los tres roles con API real. |
| DOR-03 | Node 22.22+ | CUMPLE | node --version observado: v24.11.1. |
| DOR-04 | Nombres DTO confirmados | NO VERIFICADO | Consolidar evidencia operativa actual; lectura del equipo no se infiere de archivos. |
| DOR-05 | Política403 vs404 acordada | NO VERIFICADO | Consolidar evidencia operativa actual; lectura del equipo no se infiere de archivos. |
| DOR-06 | Equipo leyó tres guías | NO VERIFICADO | Consolidar evidencia operativa actual; lectura del equipo no se infiere de archivos. |

## Definition of Done (30.2, páginas62–63)

| ID local | Página | Criterio | Estado | Evidencia / brecha / acción |
|---|---|---|---|---|
| DOD-01 | 62 | 20 páginas lazy salvo Inicio/Layout | CUMPLE | A: src/router.tsx:15–181 declara20páginas;19lazy. B: src/test/router/Router.test.tsx:8; C: public-browser-results.json/checks y roles-readonly-results.json/checks recorren rutas disponibles. |
| DOD-02 | 62 | RouterProvider/createBrowserRouter sin react-router-dom | CUMPLE | A: router.tsx y package.json inspeccionados. |
| DOD-03 | 62 | 20 operacionesF3 y3F4 alcanzablesUI | CUMPLE | A: tabla de correlación23renglones; B: suitesMSW; C:11-rutas-api/routes-api-results.json24PASS incluye20categorías, API-USERNAME yAPI-STAGENAME200. ui-business-results.json cubre crear/publicar/asociar/comprar/cancelar/usar. POSTusersUI cubierto porB; no se duplicaA3. |
| DOD-04 | 62 | Tipos derivados Zod y todas las respuestas validadas | CUMPLE | A: src/funcionalidades/{eventos,artistas,sedes,tickets,administracion}/api.ts usan validarRespuesta; auth/api.ts:22,34,51,67,83 usan parse; tipos derivadosZod. B: suites tipos/api y PerfilCuenta.test.tsx:77 rechazan contrato inválido. |
| DOD-05 | 62 | Formularios RHF+Zod | CUMPLE | A: Login.tsx:161, Registro.tsx:166, AdminCrearEvento.tsx:136, AdminEventos.tsx:91, ValidacionIngreso.tsx:163, TicketsPagadosEvento.tsx:213 y PanelCompra.tsx:163/217 usan handleSubmit/RHF y esquemasZod. B: suites formularios. |
| DOD-06 | 62 | JWT memoria/sessionStorage y Authorization | CUMPLE | A: auth/sesion.ts:15–45; lib/http.ts:84 headersBearer; B: http.test.ts:111 y Auth.test.tsx:179; las búsquedas productivas no encontraron almacenamientoJWT localStorage/cookies/URL. |
| DOD-07 | 62 | Guardas y respeto401/403 | CUMPLE | B: Auth.test.tsx:204/228, AdminFlows.test.tsx:203 y :403; C: qa-business-results.json/http registra permisos reales y privacidad, roles-readonly-results.json valida sesionesporrol. No atribuye seguridad al frontend. |
| DOD-08 | 62 | 401 limpia sesión/cache/redirige | CUMPLE | B: Auth.test.tsx:520 verifica401 autenticado y limpia sesión; :179 limpia caché; AuthNavigation.test.tsx:233 comprueba destino tras expiración. |
| DOD-09 | 62 | Errores400/401/403/404/409/500 según13 | CUMPLE | B: http.test.ts:7/47/78/101/133, Auth401/400, TKT403/404/409, ADMIN400details/409 y EstadosDatos.test.tsx:69–161500seguro/reintento. C: qa-business HTTP reales y ui-business;500/red se simulan controladamente. |
| DOD-10 | 62 | Compra identidad propia sin campo editable | CUMPLE | B: TicketsFlows.test.tsx:187–192 exige userEmailvalidado yBearer; A: PanelCompra obtiene usuarioauth. C: ui-business-results.json/steps user-compra-confirmada-0 y-1 y respuestasPOSTtickets201. |
| DOD-11 | 62 | Sin reglas de negocio UI | CUMPLE | Lectura semántica: PanelCompra.tsx confirma tipo/email sin cálculo de edad/capacidad/precio; AccionCancelarTicket y AccionUsarTicket solo muestran acciónPAID y llaman API; AdminGestionEvento publica/asocia mediante hooks y muestra respuesta. Schemas validan estructura/min0, no negocio. tickets/hooks.ts y administracion/hooks.ts actualizan caché con respuestas, sin fabricar estados. |
| DOD-12 | 62 | Carga/vacío/error cada pantalla | CUMPLE | B: EstadosDatos.test.tsx:49–61,69–106 cubre carga→500→reintento→éxito/vacío de recursos; :109–137 búsquedaAdmin; :140–161 eventosartista. MisTickets:396, suitescatálogo/listados/compras404 completan estados aplicables. 191/191 en30archivos. |
| DOD-13 | 62 | Tailwind sin construcción dinámica | CUMPLE | A:11-rutas-api/source-bundle-audit.json revisó96archivos productivos: cero patrones de Tailwind construido dinámicamente. Inspección de mapas completos complementa el barrido. |
| DOD-14 | 62 | Consistencia con imágenes oficiales | PARCIAL | AUDITORIA_VISUAL contiene comparación directa de32referencias y decisiones porfila. Cierre visual global sujeto a recapturas y revisión de adaptaciones; no usar conteo antiguo3/29. |
| DOD-15 | 62 | Móvil390 y oscuro | PARCIAL | C: public-browser-results.json80checks en4anchos/2temas; roles-readonly7checks390. Faltan variantes autenticadas/modales/32referencias. |
| DOD-16 | 62 | Responsive360 y teclado completo | PARCIAL | C:80checks sinoverflow y focused-results.json MENU-KEYBOARD; teclado completo en todos los flujos todavía no acreditado. |
| DOD-17 | 62 | Sin any/React.FC/token localStorage/HTML API | CUMPLE | A: búsqueda src productivo sin any,React.FC,dangerouslySetInnerHTML,localStorage ni BrowserRouter combinado; únicas coincidencias createBrowserRouter legítimas. tsconfig.app.json:22 strict. |
| DOD-18 | 62 | Tests sección21 pasan | CUMPLE | B:10-calidad-actual/vitest-final.txt191/191 en30archivos. TKT010 parametrizaRESERVED/USED/CANCELLED; GEN003 cubre roles; STF002 secuencia200/409; ADM004 ahoraassertcartelera. Las50condiciones oficiales están mapeadas por comportamiento, no títulos. |
| DOD-19 | 63 | Lint/build/test correctos | CUMPLE | B:191/191, lint y build comunicados por coordinación; logs en RESULTADOS_CALIDAD. |
| DOD-20 | 63 | Sin secretos y existe.env.example | PARCIAL | A:env.example rastreado. 11-rutas-api/source-bundle-audit.json inspeccionó39JS sin indicadores de claveprivada/JWTliteral/asignacióncredencial. Es barrido acotado del bundle actual, no certificación del historial ni prueba absoluta de ausencia de secretos. |
| DOD-21 | 63 | README variables/comandos/roles/rutas | CUMPLE | A: README.md:41variables, :52comandos, :91roles y :120rutas; no contiene contraseñas en los fragmentos inspeccionados. |

## Límites y acciones recomendadas

- La matriz no certifica WCAG AA ni compatibilidad entre las últimas dos versiones de cuatro navegadores; requieren evidencia específica.
- QT-FE-009/NFR-FE-009: corregido el reloj global en src/test/setup.ts:20;191/191 actuales.
- NFR-FE-007 (p58) recomienda componentes de aproximadamente150 líneas. Hay páginas extensas; registrar mantenibilidad sin reconstrucción funcional.
- GAP01 (p42/59): no existe listado administrativo completo; búsqueda por código y creados durante sesión son el alcance previsto.
- Sección26 (p60) excluye E2E y cambios API/DB del taller; la auditoría adicional no sustituye las pruebasMSW.
- No se encontró carpeta original imagenes/ en el inventario acotado; sí existen referencias embebidas en el PDF. Véase AUDITORIA_VISUAL.
- El contador500 es decisión visual conforme maqueta p43; el DTO backend puede aceptar1000, sin contradicción oculta ni cambio servidor.
- Las brechas detectadas son recomendaciones; este documento no autoriza modificaciones funcionales.

## Actualización de evidencia C/D

Auditoría visual enlaza80 recorridos públicos y7 por roles con API real y6 verificaciones focalizadas. Contraste Cartelera mínimo6.27:1 claro/7.66:1 oscuro(18 muestras por tema), campos etiquetados3/3, sin overflow a390px y menú mediante Enter. Son controles acotados; no cierran DOD14–16 completos. La auditoría visual actual compara32referencias; sus adaptaciones y diferencias se documentan porfila. Véase AUDITORIA_VISUAL y evidencias/07-accesibilidad/focused-results.json.

## Aceptación funcional completa (sección19, páginas54–55)

Los textos condensan fielmente la condición oficial sin exigir que datosDEMO repliquen identidades del ejemplo; el PDF sigue siendo fuente literal. Prefijo de pruebas:src/test/. No se confunde HTTPAPI con interacciónUI.

| ID | Página | Criterio | Prueba/código | Evidencia primaria | Estado / acción |
|---|---|---|---|---|---|
| AC-FE-001 | 54 | Cartelera anónima publicada | pages/CatalogoEventos.test.tsx:52 | evidencias/public-browser-results.json/checks VIS-catalogo-1280-light | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-002 | 54 | Detalle con nombre/categoría/edad/artistas/sede | pages/DetalleEvento.test.tsx:47 | evidencias/public-browser-results.json/checks VIS-detalle-evento-1280-light | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-003 | 54 | Inexistente/no publicado sin datos borrador | pages/DetalleEvento.test.tsx:77 | evidencias/qa-business-results.json/http GETeventsQA y404; complementar borradorpúblico | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-004 | 54 | Compra anónima→login→retorno | funcionalidades/tickets/TicketsFlows.test.tsx:201; auth/Auth.test.tsx:434 | evidencias/UIanónimo retorno pendienteC | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-005 | 54 | Registro contraseña11 bloqueaHTTP | funcionalidades/auth/Auth.test.tsx:923 | evidencias/BMSW | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-006 | 54 | Registro201→login+aviso | funcionalidades/auth/Auth.test.tsx:1061 | evidencias/BMSW | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-007 | 54 | Registro duplicado409genérico | funcionalidades/auth/Auth.test.tsx:1021 | evidencias/BMSW | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-008 | 54 | Credenciales inválidas401genéricas | funcionalidades/auth/Auth.test.tsx:124 | evidencias/qa-business-results.json/http auth/login401 | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-009 | 54 | Token sessionStorage/memoria,auth/me,nombreNavbar | funcionalidades/auth/Auth.test.tsx:85 | evidencias/roles-readonly-results.json/checks cuenta; nombreNavbar requiereassert | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-010 | 54 | CompraVIPemailpropio201confirmación | funcionalidades/tickets/TicketsFlows.test.tsx:142/188 | evidencias/ui-business-results.json/steps user-compra-confirmada-0(GENERAL;VIPenB) | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-011 | 54 | Menor409mantienemodalysin navegación | funcionalidades/tickets/TicketsFlows.test.tsx:372 | evidencias/qa-business-results.json/http tickets409; modaledadCpendiente | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-012 | 54 | CancelarPAID200actualizalistaCANCELLED | funcionalidades/tickets/TicketsFlows.test.tsx:306 | evidencias/ui-business-results.json/steps user-ticket-cancelado | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-013 | 54 | USEDsinCancelar;forzado409visible | funcionalidades/tickets/TicketsFlows.test.tsx:332/349 | evidencias/USEDsinacciónasercióndedicadapendiente | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-014 | 55 | Ajeno403/404sinprivados | funcionalidades/tickets/TicketsFlows.test.tsx:416 | evidencias/qa-business-results.json/checks Foreign read and cancellation denied without mutation | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-015 | 55 | USERenADMIN403yAPI403 | funcionalidades/auth/Auth.test.tsx:228 | evidencias/qa-business-results.json/http permisos | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-016 | 55 | STAFFusa200yrepite409 | funcionalidades/staff/StaffFlows.test.tsx:111/163 | evidencias/ui-business-results.json/steps staff-ticket-usado;409APIqa-business | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-017 | 55 | ADMINvacíoerroresyceroHTTP | funcionalidades/admin/AdminFlows.test.tsx:203 | evidencias/BMSW | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-018 | 55 | PublicarDRAFTbadgeycartelera | funcionalidades/admin/AdminFlows.test.tsx:316 | evidencias/ui-business-results.json/steps admin-evento-publicado;carteleraassertpendiente | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-019 | 55 | 401limpiasesión,caché,login | funcionalidades/auth/Auth.test.tsx:520 | evidencias/AuthNavigation.test.tsx:233 B | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-020 | 55 | Ruta404 | router/Router.test.tsx:8 | evidencias/public-browser-results.json/checks VIS-404-1280-light | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |
| AC-FE-021 | 55 | Sinnegocioedad/capacidad/transicionesUI | PanelCompra.tsx:124–142; AccionCancelarTicket.tsx:33–50; AccionUsarTicket.tsx:35–50; AdminGestionEvento.tsx:48–66; tickets/hooks.ts:71–98,112–173 | Lectura semántica de orquestación y mutaciones: no compara edad ni capacidad; envía API y aplica respuesta del servidor. | CUMPLE: visibilidad por estado y validación estructural son reglasUI expresamente solicitadas porPRD; no se calcula transición ni precio. |
| AC-FE-022 | 55 | 20operacionesF3+3F4invocablesUI | TablaAPIycorrelacióndebajo | evidencias/TrazasUIde23renglonespendientesconsolidación | CUMPLE: condición funcional cubierta mediante evidencia A/B y C indicada; cuando el caso es MSW se conserva esa distinción, sin convertirlo en E2E. |

## Calidad (20.1, páginas55–56)

| ID | Página | Criterio | Evidencia/código | Estado | Acción |
|---|---|---|---|---|---|
| QT-FE-001 | 55 | Estados de cada página de datos | src/test/pages/EstadosDatos.test.tsx:49–161, MisTickets:396 y pruebas de vacío/404 existentes | CUMPLE | Carga/error500/reintento/recuperación verificados; ausencia singular=404, no se inventa lista vacía para perfil/login/error. |
| QT-FE-002 | 55 | Preferir getByRole/findByRole | src/test/pages/CatalogoEventos.test.tsx:52; Auth.test.tsx:85 | CUMPLE | Mantenerlímitedepruebaindicado;actualizarconlogsfinales. |
| QT-FE-003 | 55 | Formularios: obligatorio,formato,envío | Auth.test.tsx:854/923/1061; RegistroContrato; AdminFlows.test.tsx:205/280; StaffFlows:278; tipoTicketenum en TicketsFlows | CUMPLE | Formatos según contrato; no se inventan regex para códigos ni identidadeditable. |
| QT-FE-004 | 55 | Guardas anónimoUSERSTAFFADMIN | Auth.test.tsx:204/228; AdminFlows:203/403; PerfilCuenta:89 | CUMPLE | Mantenerlímitedepruebaindicado;actualizarconlogsfinales. |
| QT-FE-005 | 55 | Mapeo400401403404409500UI | http.test.ts:7/47/78/101/133 y suites | CUMPLE | Mantenerlímitedepruebaindicado;actualizarconlogsfinales. |
| QT-FE-006 | 55 | InválidoceroHTTP | Auth.test.tsx:854/923; AdminFlows:203 | CUMPLE | Mantenerlímitedepruebaindicado;actualizarconlogsfinales. |
| QT-FE-007 | 55 | TokensoloAuthorization | http.test.ts:111; TicketsFlows:192 | CUMPLE | Mantenerlímitedepruebaindicado;actualizarconlogsfinales. |
| QT-FE-008 | 55 | Caché tras mutaciones | tickets/hooks.ts:90–98,125–144,165–173; administracion/hooks.ts:60–74,140–145. Tests TKT193,STF156/238,ADM246/320/384 | CUMPLE | Se verifica resultado actualizado y consultas de detalle/listas;191/191 incluye casos de publicacióncartelera y uso/cancelación. |
| QT-FE-009 | 55 | Sin red ni reloj reales | src/test/setup.ts:20–22 usa fakeTimers soloDate y setSystemTime, MSW global | CUMPLE | Date.now y newDate congelados; timersUI continúan reales para user-event.191/191. |
| QT-FE-010 | 56 | Lint/build/testsinerror | RESULTADOS_CALIDAD y logs coordinación191/191 | CUMPLE | Mantenerlímitedepruebaindicado;actualizarconlogsfinales. |
| QT-FE-011 | AuditoríaLighthouse/axesincríticospáginasprincipales | 10-calidad-actual/axe-public.json36escenarios yaxe-roles.json14; LHactualAccessibility100 | CUMPLE | Resultadoautomáticoacotado; no certificaWCAGAAcompleta. |

## No funcionales (23, página58)

| ID | Criterio | Evidencia | Estado |
|---|---|---|---|
| NFR-FE-001 | WCAG2.1AA,tecladocompleto,foco,labels | Campo.tsx:23–33; focused-results.json6checks;completofalta | PARCIAL |
| NFR-FE-002 | Usabledesde360,sinoverflow | public-browser-results.json/checks80yroles-readonly7;modalesfaltan | PARCIAL |
| NFR-FE-003 | Lazy, Inicio sin admin/staff y Performance≥80 | 11-rutas-api/environment-lazy-results.json:Inicio8recursos,sinchunksADMIN/STAFF. Lighthouseactual20:55:52UTC Performance100 | CUMPLE |
| NFR-FE-004 | SinsecretosbundletokenURL/log/localStorage,errorstexto | http.ts;auth/sesion.ts;barridosecretosbundlependiente | PARCIAL |
| NFR-FE-005 | StrictsinanyZod | tsconfig.app.json:22–23;apisvalidanrespuesta | CUMPLE |
| NFR-FE-006 | TodoserroresApiError | `src/lib/http.ts`:ApiError/construirErrorHttp/http;`src/lib/validacion.ts`:validarRespuesta;`src/funcionalidades/auth/api.ts`;`src/test/funcionalidades/auth/AuthApiErrors.test.ts`;`src/test/lib/http.test.ts`. Respuestas200/201válidaseinválidas,401yexcepcionesZodverificadas. Resultadoactual77/77pruebasauth/HTTPy203/203totales. | CUMPLE |
| NFR-FE-007 | Funcionalidades,componentes≤~150,UIreusable | estructuraexistente;páginasextensascomoAdminCrearEvento260líneas | PARCIAL |
| NFR-FE-008 | es-COIntlfechasCOP | componentes/PrecioCOP.tsx:5; funcionalidades/tickets/formato.ts | CUMPLE |
| NFR-FE-009 | Determinismo de fechas y aislamiento de red | src/test/setup.ts:20–22 fakeDate/setSystemTime y MSW;191/191 | CUMPLE |
| NFR-FE-010 | ÚltimasdosversionesChrome/Edge/Firefox/Safari | Chrome157.0.8103.80 yEdge158.0.4370.33 abrieronInicio. Firefox/WebKit ejecutablesnoinstalados; nohistorial2versiones | PARCIAL |

## Anti-patrones (24, páginas58–59)

| Sección | Página | Prohibición | Evidencia | Estado |
|---|---|---|---|---|
| 24.1 | 58 | ReglasdenegocioUI | Lectura semántica de PanelCompra, AccionCancelarTicket, AccionUsarTicket, AdminGestionEvento, schemas y hooks; sin cálculos de edad/capacidad o transiciones locales. | CUMPLE |
| 24.2 | 58 | ConfiarenUIcomoseguridad | qa-business/checksForeignreadandcancellationdenied/backend403 | CUMPLE |
| 24.3 | 59 | Emailcompradoreditable | TicketsFlows:188yPanelComprasesión | CUMPLE |
| 24.4 | 59 | Tailwinddinámico | 11-rutas-api/source-bundle-audit.json:96fuentes,sinpatrónTailwinddinámico;mapascompletosinspeccionados. | CUMPLE |
| 24.5 | 59 | CopiarQueryaestado | Adminhooks:36/51cache;AdminEventos:44soloidentificador | CUMPLE |
| 24.6 | 59 | JWTlocalStorage/cookies/URL/log | sesion.ts:15–45;http.test:111;búsquedaproductiva | CUMPLE |
| 24.7 | 59 | Mezclarrouters/importreact-router-dom | router.tsx:1/181;package.json | CUMPLE |
| 24.8 | 59 | InterfacesrespuestasmanualessinZod | tiposporfuncionalidadderivados;apisZod | CUMPLE |
| 24.9 | 59 | useEffect+fetchdatosservidor | AuthContextidentidadexcepciónsesión;hooksTanStackrecurso | CUMPLE |
| 24.10 | 59 | HTMLAPIinyectado | BúsquedaproductivasindangerouslySetInnerHTML | CUMPLE |

## Correlación API → hook → acción UI → evidencia primaria

No se cuentan A3 y operación12 como endpointsdistintos: ambosPOSTusers. Las referencias JSON son selectoresporcontenido,no númerosdeíndice frágiles.

| Tabla10.3 | Hook/acción | Evidencia exacta disponible | Pendiente |
|---|---|---|---|
| 1 | useSede;linktarjetasSedes | public-browser-results.json/checks VIS-detalle-sede-1280-light | Ningunoenrecorridofeliz |
| 2 | useSedesActivas;lista/selectADMIN | roles-readonly-results.json/checks route=/admin/eventos/nuevo;public-browser-results.json/checks VIS-sedes-1280-light |  |
| 3 | useCrearEventoAdmin;submitCrear | ui-business-results.json/steps name=admin-evento-creado;httpPOST/api/events201 |  |
| 4 | useEvento/useEventoAdmin;búsqueda/verdetalle | public-browser-results.json/checks VIS-detalle-evento-1280-light;ui-business-results.json/stepsadmin-evento-creado |  |
| 5 | useEventosPublicados;abrirInicio/cartelera | public-browser-results.json/checks VIS-catalogo-1280-light |  |
| 6 | usePublicarEventoAdmin;confirmaciónPublicar | ui-business-results.json/steps admin-evento-publicado;httpPATCHpublish200 |  |
| 7 | useAsociarArtistaAdmin;Asociar | ui-business-results.json/steps admin-artista-asociado;httpPOSTartists200 |  |
| 8 | useEventosPorArtista;filtro/artista | 07-accesibilidad/focused-results.json/checks FILTER-ARTIST;public-browser-results.json/http path=/api/events/by-artist status=200 | Traza GET real conservada en http. |
| 9 | useArtista;linktarjeta | public-browser-results.json/checks VIS-detalle-artista-1280-light |  |
| 10 | useArtistaPorNombre;hookCatalogo filtroartista | src/funcionalidades/eventos/hooksCatalogo.ts:7;artistas/hooks.ts:50;CatalogoEventos.test:137 | TrazaUIespecíficaby-stage-nameaúnnoconsolidada |
| 11 | useArtistasActivos;abrirlista/selectADMIN | public-browser-results.json/checks VIS-artistas-1280-light |  |
| 12/A3 | useRegistrarUsuario;submitRegistro | Auth.test.tsx:1061MSWPOSTusers201;qa-business/httpPOSTusers201API | RegistroUIrealpendiente |
| 13 | useMiPerfil;abrirCuenta/email | roles-readonly-results.json/checks route=/cuenta;PerfilCuenta.test:89 |  |
| 14 | useUsuarioPorUsername;botónenCuenta | Cuenta.tsx:19;PerfilCuenta.test:89/137 | TrazaUIrealporusernamependiente |
| 15 | useComprarTicket;confirmarmodal | ui-business-results.json/steps user-compra-confirmada-0/-1;httpPOSTtickets201 |  |
| 16 | useTicket;abrirdetalle/confirmación/buscar | ui-business-results.json/steps user-ticket-cancelado,staff-ticket-pagado |  |
| 17 | useTicketsUsuario;abrirMisTickets | roles-readonly-results.json/checks route=/mis-tickets |  |
| 18 | useTicketsPagadosPorEvento;buscarevento | StaffFlows.test:207;qa-business/httpGETevents*/tickets/paid | UIrealpagadospendienteconsolidación |
| 19 | useCancelarTicket;confirmarCancelar | ui-business-results.json/steps user-ticket-cancelado;httpPATCHcancel200 |  |
| 20 | useUsarTicket;marcarusado | ui-business-results.json/steps staff-ticket-usado;httpPATCHuse200 |  |
| A1 | iniciarSesionAuthContext;Ingresar | roles-readonly-results.json/checks;qa-business/httpPOSTauth/login200 |  |
| A2 | obtenerPerfilAutenticadoApi;restaurarCuenta | roles-readonly-results.json/checks route=/cuenta;qa-business/httpGETauth/me200 |  |

## Referencias visuales32

El inventario completo32referencias con página y captura está en [AUDITORIA_VISUAL](AUDITORIA_VISUAL.md#referencias-y-cobertura). La comparación directa de32referencias está documentada por el auditor visual; consultar sus estados finales porfila. No se duplica una aprobación de ejecución como equivalencia visual.

## Cierre operativo actual de rutas, contratos y calidad

Fecha de verificación:23nov2026. `11-rutas-api/routes-api-results.json` conserva24comprobacionesPASS,36HTTP,20capturas de las20categorías de ruta, rol,URL,h1,viewport1280x900 y respuestaHTTP. Los cuatro controles adicionales son consulta propia porusername, artista porstageName, guarda anónima hacia login y USER hacia403. Sin erroresJS ni escriturasAPI (login estateless autorizado). La confirmación se abrió medianteGET de ticketpropio existente; no se hizo una nueva compra.

La consulta username se ejercitó desde el botón deCuenta y respondió200. La resolución artista se ejercitó mediante select deCartelera y `/api/artists/by-stage-name` respondió200. Esto cierra los pendientes de alcanzabilidad: ambas funciones se invocan por acciones existentes, no solo por código exportado.

`11-rutas-api/source-bundle-audit.json`:96archivosTS/TSXproductivos,39JSgenerados; sin indicadores any,React.FC,HTMLinyectado,legacyRouter,Tailwinddinámico o cálculoedad/capacidad del patrón revisado. Bundle sin indicadores de clavesprivadas,JWTliteral o asignacióncredenciales. Se conservaron rutas ySHA256, nunca valores coincidentes. El barrido es heurístico y no sustituye auditoría semántica ni revisión del historial.

`11-rutas-api/environment-lazy-results.json`: Chrome157.0.8103.80 yEdge158.0.4370.33 disponibles; ambos abrenInicio. Chrome registra8recursosiniciales y cerochunksADMIN/STAFF. Firefox yWebKit no disponibles en caché; no se instalaron. Compatibilidadúltimasdosversiones siguePARCIAL.

Lighthouseactual: `10-calidad-actual/lighthouse-mobile.report.json`, fetchTime2026-11-23T21:06:11.807Z:Performance100,Accessibility100,BestPractices100,SEO82. Inicio con catálogo real; sin cambiosSEO. Axeactual:36escenariospúblicos y14porroles, cero violaciones reportadas y8incomplete que requieren juicio humano. La certificación manualWCAG,32equivalenciasvisuales y estadosporpantalla permanecen sujetas a sus evidencias específicas.

### Pendientes documentales que no deben ocultarse

- DOD11: cerrado mediante lectura semántica de los flujos; evidencia detallada en su fila.
- DOD12/QT001: cerrado con EstadosDatos.test.tsx y suites de estados existentes; véase tabla final.
- DOD14–16: actualizar solo tras comparación32referencias/teclado y variantes autenticadas completas.
- DOD20: el barrido del bundle no equivale a revisión total del historial.
- NFR007: componentes mayores de≈150líneas como decisión de mantenibilidad; NFR010: navegadores/versiones faltantes.

### Verificación semántica de negocio y límite de visibilidad

Se leyeron las ramas de acciones de compra/cancelación/uso/publicación/asociación y sus hooks. `PanelCompra` no recibe edadusuario/capacidad y no calcula precio; el modal solo presenta evento,tipo,emailpropio. Los schemas de compra aceptan tipoenum; crearEvento valida formato y mínimoestructural0 como sección11. Las accionesPAID yPUBLISHED/DRAFT controlan presentación conforme9.5/9.11/9.18. Las mutaciones reciben el TicketResponse/EventResponse del servidor y actualizan Query con eseobjeto, no calculan la transición final. Se cierra AC021/DOD11 por auditoría semántica, conservando la prueba backend de edad/capacidad como evidencia de autoridadreal.



## Evidencia final de estados y regresión

La ejecución final registrada en `10-calidad-actual/vitest-final.txt` aprobó203/203 en32archivos,17.72s. Los logs `lint-final.txt` y `build-final.txt` registran lint y build correctos de la ejecución actual. Los resultados196/196,191/191y161/161 se conservan como históricos. El mock del reloj congela Datecompleto mediante vi.useFakeTimers({toFake:['Date']}) yvi.setSystemTime; se restaura al finalizar cadacaso.

| Página/recurso | Prueba de carga,error,reintento,recuperación | Ausencia aplicable |
|---|---|---|
| Cuenta | EstadosDatos.test.tsx:49–106,casoCuenta | Recurso singular; error/denegación, no lista vacía ficticia. |
| CatalogoEventos | EstadosDatos.test.tsx:casoCatalogo y69–106 | CatalogoEventos.test.tsx:75 vacío. |
| DetalleTicket yConfirmacionCompra | EstadosDatos.test.tsx:casosUSER y69–106 | TicketsFlows.test.tsx:ajeno403/404; recurso singular. |
| AdminCrearEvento | EstadosDatos.test.tsx:casosedes y69–106 | Sedesvacías trasreintento; formulario no se publica. |
| AdminGestionEvento yartistasactivos | EstadosDatos.test.tsx:casosevento/artistas y69–106 | Listaartistasvacía; eventoinexistente404. |
| AdminEventos | EstadosDatos.test.tsx:109–137 | InicialsincreadosyceroHTTP; consulta bajo demanda. |
| TicketsPagadosEvento | EstadosDatos.test.tsx:casoSTAFF y69–106 | Sin ticketspagados alrecuperar lista vacía. |
| ListaArtistas | EstadosDatos.test.tsx:casoListaArtistas y69–106 | Lista vacía alrecuperar; éxito en suite propia. |
| ListaSedes | EstadosDatos.test.tsx:casoListaSedes y69–106 | ListaSedes.test.tsx:65 vacío. |
| DetalleSede | EstadosDatos.test.tsx:casoDetalleSede y69–106 | DetalleSede.test.tsx:48=404. |
| DetalleArtista/eventosasociados | EstadosDatos.test.tsx:casoDetalleArtista y140–161 | Sin eventospróximos y404 en suite propia. |
| Inicio | EstadosDatos.test.tsx:casoInicio y69–106 | Inicio.test.tsx:103 vacío. |
| DetalleEvento | EstadosDatos.test.tsx:casoDetalleEvento y69–106 | Evento404 yartistasvacíos en suite propia. |
| MisTickets | TicketsFlows.test.tsx:396 | Carga,error,reintento,vacío explícitos; listadoéxito en245. |

Login,Registro,403,404 yerrorElement tienen pruebas de formularios/guardas/renderizado propias; no consultan una lista remota cuyo vacío deba simularse. El alcance no inventa estados fuera del contrato.

Lighthouse finaldelbuildcongelado:fetch2026-11-23T21:06:11.807Z,100Performance/100Accessibility/100BestPractices/82SEO,FCP0.8s,LCP0.8s,TBT10ms,CLS0,SI0.8s. Axe36públicos+14roles:cero violaciones;8incomplete requieren revisiónhumana y no son automáticamente fallos ni aprobaciónmanualWCAG. Edge20rutas/24PASS/36HTTP aporta cobertura adicional; no satisface últimasdosversiones de cuatro navegadores.

## Estado final de esta matriz

Conteos regenerados desde las celdas de estado, conservados en `evidencias/11-rutas-api/matrix-status-counts.json`:33FR(31CUMPLE,2PARCIAL),20rutasCUMPLE,23renglonesAPICUMPLE,50testsCUMPLE,22ACCUMPLE,11QTCUMPLE,10anti-patronesCUMPLE,21DoD(17CUMPLE,4PARCIAL),6DoR(3CUMPLE,3NO VERIFICADO),10NFR(5CUMPLE,5PARCIAL). Las23filasAPI incluyenPOSTusers repetido enA3:22operacionesHTTPúnicas.

Pendientes concretos:FRGEN003 requiere confirmar comportamiento temporal4s de todosavisos,FRGEN004 alternancia/preferenciaoscura según opciónCould;DoD14adaptacionesvisuales32,DoD15variantesespecíficasautenticadasoscuro,DoD16tecladocompleto yDoD20alcancedelhistorialsecretos. NFR001 requiere juiciohumano de8incompleteaxe y cobertura completa teclado;NFR002variantesmodales no están exhaustivas;NFR004ausenciasecretoshistorial no se certifica porbundle;NFR007páginas>≈150líneas comoobservaciónmantenibilidad;NFR010dosversiones/todosnavegadores no disponibles. NFR-FE-006 quedó CUMPLE tras verificarse el bloqueo seguro de respuestas estructuralmente inválidas y el tratamiento uniforme de errores HTTP. DoR:confirmación humana lectura3guías, acuerdoscontrato ypolítica403/404 no se inventa con baseen archivos.

Estos pendientes no invalidan las196pruebas ni convierten las pruebasMSW enE2E. Las decisiones de adaptaciónvisual yrevisiónhumana deben reflejarse mediante evidencia o aceptación explícita antes de declararse cierreintegral.
