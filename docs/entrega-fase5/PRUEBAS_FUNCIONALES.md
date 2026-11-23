# Pruebas funcionales ejecutadas

Fecha: 23 de noviembre de 2026. Los registros de este documento fueron leídos desde los JSON primarios. No se sustituyen pruebas de navegador por pruebas API.

## Navegador público con API real

Precondición común: frontend 4173, API 8080, PostgreSQL pulsepass/5433 con catálogo poblado. Entrada: ruta y viewport de cada fila. Pasos comunes: abrir la ruta, esperar networkidle, consultar h1/ancho de documento/tema y capturar PNG. Resultado esperado: encabezado y documento sin desbordamiento. El PASS tiene ese alcance; no acredita clics de filtros ni todos los estados de error.

| ID | Ruta | Rol | Viewport/tema | Obtenido | Estado | Evidencia |
|---|---|---|---|---|---|---|
| VIS-inicio-360-light | / | PUBLIC | 360×900 / light | ancho 360; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/inicio-360-light.png) |
| VIS-catalogo-360-light | /eventos | PUBLIC | 360×900 / light | ancho 360; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/catalogo-360-light.png) |
| VIS-detalle-evento-360-light | /eventos/DEMO-EVENT-MUSIC-001 | PUBLIC | 360×900 / light | ancho 360; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/detalle-evento-360-light.png) |
| VIS-artistas-360-light | /artistas | PUBLIC | 360×900 / light | ancho 360; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/artistas-360-light.png) |
| VIS-detalle-artista-360-light | /artistas/3 | PUBLIC | 360×900 / light | ancho 360; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/detalle-artista-360-light.png) |
| VIS-sedes-360-light | /sedes | PUBLIC | 360×900 / light | ancho 360; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/sedes-360-light.png) |
| VIS-detalle-sede-360-light | /sedes/DEMO-VENUE-ARENA | PUBLIC | 360×900 / light | ancho 360; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/detalle-sede-360-light.png) |
| VIS-login-360-light | /login | PUBLIC | 360×900 / light | ancho 360; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/login-360-light.png) |
| VIS-registro-360-light | /registro | PUBLIC | 360×900 / light | ancho 360; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/registro-360-light.png) |
| VIS-404-360-light | /qa-ruta-inexistente | PUBLIC | 360×900 / light | ancho 360; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/404-360-light.png) |
| VIS-inicio-360-dark | / | PUBLIC | 360×900 / dark | ancho 360; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/inicio-360-dark.png) |
| VIS-catalogo-360-dark | /eventos | PUBLIC | 360×900 / dark | ancho 360; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/catalogo-360-dark.png) |
| VIS-detalle-evento-360-dark | /eventos/DEMO-EVENT-MUSIC-001 | PUBLIC | 360×900 / dark | ancho 360; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/detalle-evento-360-dark.png) |
| VIS-artistas-360-dark | /artistas | PUBLIC | 360×900 / dark | ancho 360; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/artistas-360-dark.png) |
| VIS-detalle-artista-360-dark | /artistas/3 | PUBLIC | 360×900 / dark | ancho 360; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/detalle-artista-360-dark.png) |
| VIS-sedes-360-dark | /sedes | PUBLIC | 360×900 / dark | ancho 360; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/sedes-360-dark.png) |
| VIS-detalle-sede-360-dark | /sedes/DEMO-VENUE-ARENA | PUBLIC | 360×900 / dark | ancho 360; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/detalle-sede-360-dark.png) |
| VIS-login-360-dark | /login | PUBLIC | 360×900 / dark | ancho 360; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/login-360-dark.png) |
| VIS-registro-360-dark | /registro | PUBLIC | 360×900 / dark | ancho 360; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/registro-360-dark.png) |
| VIS-404-360-dark | /qa-ruta-inexistente | PUBLIC | 360×900 / dark | ancho 360; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/404-360-dark.png) |
| VIS-inicio-390-light | / | PUBLIC | 390×900 / light | ancho 390; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/inicio-390-light.png) |
| VIS-catalogo-390-light | /eventos | PUBLIC | 390×900 / light | ancho 390; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/catalogo-390-light.png) |
| VIS-detalle-evento-390-light | /eventos/DEMO-EVENT-MUSIC-001 | PUBLIC | 390×900 / light | ancho 390; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/detalle-evento-390-light.png) |
| VIS-artistas-390-light | /artistas | PUBLIC | 390×900 / light | ancho 390; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/artistas-390-light.png) |
| VIS-detalle-artista-390-light | /artistas/3 | PUBLIC | 390×900 / light | ancho 390; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/detalle-artista-390-light.png) |
| VIS-sedes-390-light | /sedes | PUBLIC | 390×900 / light | ancho 390; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/sedes-390-light.png) |
| VIS-detalle-sede-390-light | /sedes/DEMO-VENUE-ARENA | PUBLIC | 390×900 / light | ancho 390; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/detalle-sede-390-light.png) |
| VIS-login-390-light | /login | PUBLIC | 390×900 / light | ancho 390; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/login-390-light.png) |
| VIS-registro-390-light | /registro | PUBLIC | 390×900 / light | ancho 390; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/registro-390-light.png) |
| VIS-404-390-light | /qa-ruta-inexistente | PUBLIC | 390×900 / light | ancho 390; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/404-390-light.png) |
| VIS-inicio-390-dark | / | PUBLIC | 390×900 / dark | ancho 390; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/inicio-390-dark.png) |
| VIS-catalogo-390-dark | /eventos | PUBLIC | 390×900 / dark | ancho 390; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/catalogo-390-dark.png) |
| VIS-detalle-evento-390-dark | /eventos/DEMO-EVENT-MUSIC-001 | PUBLIC | 390×900 / dark | ancho 390; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/detalle-evento-390-dark.png) |
| VIS-artistas-390-dark | /artistas | PUBLIC | 390×900 / dark | ancho 390; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/artistas-390-dark.png) |
| VIS-detalle-artista-390-dark | /artistas/3 | PUBLIC | 390×900 / dark | ancho 390; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/detalle-artista-390-dark.png) |
| VIS-sedes-390-dark | /sedes | PUBLIC | 390×900 / dark | ancho 390; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/sedes-390-dark.png) |
| VIS-detalle-sede-390-dark | /sedes/DEMO-VENUE-ARENA | PUBLIC | 390×900 / dark | ancho 390; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/detalle-sede-390-dark.png) |
| VIS-login-390-dark | /login | PUBLIC | 390×900 / dark | ancho 390; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/login-390-dark.png) |
| VIS-registro-390-dark | /registro | PUBLIC | 390×900 / dark | ancho 390; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/registro-390-dark.png) |
| VIS-404-390-dark | /qa-ruta-inexistente | PUBLIC | 390×900 / dark | ancho 390; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/404-390-dark.png) |
| VIS-inicio-768-light | / | PUBLIC | 768×900 / light | ancho 768; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/inicio-768-light.png) |
| VIS-catalogo-768-light | /eventos | PUBLIC | 768×900 / light | ancho 768; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/catalogo-768-light.png) |
| VIS-detalle-evento-768-light | /eventos/DEMO-EVENT-MUSIC-001 | PUBLIC | 768×900 / light | ancho 768; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/detalle-evento-768-light.png) |
| VIS-artistas-768-light | /artistas | PUBLIC | 768×900 / light | ancho 768; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/artistas-768-light.png) |
| VIS-detalle-artista-768-light | /artistas/3 | PUBLIC | 768×900 / light | ancho 768; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/detalle-artista-768-light.png) |
| VIS-sedes-768-light | /sedes | PUBLIC | 768×900 / light | ancho 768; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/sedes-768-light.png) |
| VIS-detalle-sede-768-light | /sedes/DEMO-VENUE-ARENA | PUBLIC | 768×900 / light | ancho 768; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/detalle-sede-768-light.png) |
| VIS-login-768-light | /login | PUBLIC | 768×900 / light | ancho 768; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/login-768-light.png) |
| VIS-registro-768-light | /registro | PUBLIC | 768×900 / light | ancho 768; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/registro-768-light.png) |
| VIS-404-768-light | /qa-ruta-inexistente | PUBLIC | 768×900 / light | ancho 768; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/404-768-light.png) |
| VIS-inicio-768-dark | / | PUBLIC | 768×900 / dark | ancho 768; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/inicio-768-dark.png) |
| VIS-catalogo-768-dark | /eventos | PUBLIC | 768×900 / dark | ancho 768; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/catalogo-768-dark.png) |
| VIS-detalle-evento-768-dark | /eventos/DEMO-EVENT-MUSIC-001 | PUBLIC | 768×900 / dark | ancho 768; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/detalle-evento-768-dark.png) |
| VIS-artistas-768-dark | /artistas | PUBLIC | 768×900 / dark | ancho 768; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/artistas-768-dark.png) |
| VIS-detalle-artista-768-dark | /artistas/3 | PUBLIC | 768×900 / dark | ancho 768; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/detalle-artista-768-dark.png) |
| VIS-sedes-768-dark | /sedes | PUBLIC | 768×900 / dark | ancho 768; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/sedes-768-dark.png) |
| VIS-detalle-sede-768-dark | /sedes/DEMO-VENUE-ARENA | PUBLIC | 768×900 / dark | ancho 768; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/detalle-sede-768-dark.png) |
| VIS-login-768-dark | /login | PUBLIC | 768×900 / dark | ancho 768; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/login-768-dark.png) |
| VIS-registro-768-dark | /registro | PUBLIC | 768×900 / dark | ancho 768; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/registro-768-dark.png) |
| VIS-404-768-dark | /qa-ruta-inexistente | PUBLIC | 768×900 / dark | ancho 768; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/404-768-dark.png) |
| VIS-inicio-1280-light | / | PUBLIC | 1280×900 / light | ancho 1280; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/inicio-1280-light.png) |
| VIS-catalogo-1280-light | /eventos | PUBLIC | 1280×900 / light | ancho 1280; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/catalogo-1280-light.png) |
| VIS-detalle-evento-1280-light | /eventos/DEMO-EVENT-MUSIC-001 | PUBLIC | 1280×900 / light | ancho 1280; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/detalle-evento-1280-light.png) |
| VIS-artistas-1280-light | /artistas | PUBLIC | 1280×900 / light | ancho 1280; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/artistas-1280-light.png) |
| VIS-detalle-artista-1280-light | /artistas/3 | PUBLIC | 1280×900 / light | ancho 1280; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/detalle-artista-1280-light.png) |
| VIS-sedes-1280-light | /sedes | PUBLIC | 1280×900 / light | ancho 1280; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/sedes-1280-light.png) |
| VIS-detalle-sede-1280-light | /sedes/DEMO-VENUE-ARENA | PUBLIC | 1280×900 / light | ancho 1280; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/detalle-sede-1280-light.png) |
| VIS-login-1280-light | /login | PUBLIC | 1280×900 / light | ancho 1280; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/login-1280-light.png) |
| VIS-registro-1280-light | /registro | PUBLIC | 1280×900 / light | ancho 1280; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/registro-1280-light.png) |
| VIS-404-1280-light | /qa-ruta-inexistente | PUBLIC | 1280×900 / light | ancho 1280; h1 presente; tema oscuro=False | PASS | [PNG](evidencias/06-responsive/404-1280-light.png) |
| VIS-inicio-1280-dark | / | PUBLIC | 1280×900 / dark | ancho 1280; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/inicio-1280-dark.png) |
| VIS-catalogo-1280-dark | /eventos | PUBLIC | 1280×900 / dark | ancho 1280; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/catalogo-1280-dark.png) |
| VIS-detalle-evento-1280-dark | /eventos/DEMO-EVENT-MUSIC-001 | PUBLIC | 1280×900 / dark | ancho 1280; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/detalle-evento-1280-dark.png) |
| VIS-artistas-1280-dark | /artistas | PUBLIC | 1280×900 / dark | ancho 1280; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/artistas-1280-dark.png) |
| VIS-detalle-artista-1280-dark | /artistas/3 | PUBLIC | 1280×900 / dark | ancho 1280; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/detalle-artista-1280-dark.png) |
| VIS-sedes-1280-dark | /sedes | PUBLIC | 1280×900 / dark | ancho 1280; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/sedes-1280-dark.png) |
| VIS-detalle-sede-1280-dark | /sedes/DEMO-VENUE-ARENA | PUBLIC | 1280×900 / dark | ancho 1280; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/detalle-sede-1280-dark.png) |
| VIS-login-1280-dark | /login | PUBLIC | 1280×900 / dark | ancho 1280; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/login-1280-dark.png) |
| VIS-registro-1280-dark | /registro | PUBLIC | 1280×900 / dark | ancho 1280; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/registro-1280-dark.png) |
| VIS-404-1280-dark | /qa-ruta-inexistente | PUBLIC | 1280×900 / dark | ancho 1280; h1 presente; tema oscuro=True | PASS | [PNG](evidencias/06-responsive/404-1280-dark.png) |

## Navegador autenticado de lectura

Precondición: actores autenticables y credenciales locales DPAPI. Pasos: abrir login, introducir credenciales de su actor sin registrarlas en logs, ingresar, navegar a la ruta y capturar. Resultado esperado: pantalla protegida visible tras login. Todas las peticiones mutantes salvo login se bloquearon en este recorrido; no hubo intentos bloqueados.

| ID | Rol | Ruta | Resultado obtenido | Estado | Evidencia |
|---|---|---|---|---|---|
| REAL-ROLE-01 | USER_A | /cuenta | Encabezado visible, viewport390 | PASS | [PNG](evidencias/03-user/cuenta-390.png) |
| REAL-ROLE-02 | USER_A | /mis-tickets | Encabezado visible, viewport390 | PASS | [PNG](evidencias/03-user/mis-tickets-390.png) |
| REAL-ROLE-03 | STAFF | /cuenta | Encabezado visible, viewport390 | PASS | [PNG](evidencias/04-staff/cuenta-390.png) |
| REAL-ROLE-04 | STAFF | /staff/validacion | Encabezado visible, viewport390 | PASS | [PNG](evidencias/04-staff/staff-validacion-390.png) |
| REAL-ROLE-05 | ADMIN | /cuenta | Encabezado visible, viewport390 | PASS | [PNG](evidencias/05-admin/cuenta-390.png) |
| REAL-ROLE-06 | ADMIN | /admin/eventos | Encabezado visible, viewport390 | PASS | [PNG](evidencias/05-admin/admin-eventos-390.png) |
| REAL-ROLE-07 | ADMIN | /admin/eventos/nuevo | Encabezado visible, viewport390 | PASS | [PNG](evidencias/05-admin/admin-eventos-nuevo-390.png) |

## Reglas de negocio mediante HTTP real

Ejecución QA `20261123133701`. Precondición: actores preparados y eventos QA separados de los estables. Datos de entrada: cuerpos de creación/compra definidos en `scripts/Verify-QaBusinessFlows.ps1`, identidades propias y códigos QA generados. Pasos: autenticación; crear/asociar/publicar; comprar; intentar acceso ajeno; validar/repetir; cancelar; probar edad y capacidad. Resultado esperado por solicitud: código indicado en la tabla. Los 403/409 esperados cuentan como PASS cuando coinciden y se comprueba la invariante correspondiente. No son errores inesperados.

El registro primario saneado se conserva en el directorio local del propietario `PulsePass/demo-delivery/qa-20261123133701.json`. La coordinación debe incorporar su copia a las evidencias del paquete; no contiene contraseñas ni JWT.

| ID | Método | Ruta API (prefijo /api) | Esperado | Obtenido | Estado |
|---|---|---|---|---|---|
| QA-HTTP-01 | POST | /auth/login | 200 | 200 | PASS |
| QA-HTTP-02 | POST | /auth/login | 200 | 200 | PASS |
| QA-HTTP-03 | POST | /auth/login | 200 | 200 | PASS |
| QA-HTTP-04 | POST | /auth/login | 200 | 200 | PASS |
| QA-HTTP-05 | POST | /auth/login | 200 | 200 | PASS |
| QA-HTTP-06 | POST | /events | 201 | 201 | PASS |
| QA-HTTP-07 | GET | /artists/active | 200 | 200 | PASS |
| QA-HTTP-08 | POST | /events/QA-20261123133701-FLOW/artists/3 | 200 | 200 | PASS |
| QA-HTTP-09 | POST | /events/QA-20261123133701-FLOW/artists/3 | 409 | 409 | PASS |
| QA-HTTP-10 | PATCH | /events/QA-20261123133701-FLOW/publish | 200 | 200 | PASS |
| QA-HTTP-11 | PATCH | /events/QA-20261123133701-FLOW/publish | 409 | 409 | PASS |
| QA-HTTP-12 | POST | /tickets | 201 | 201 | PASS |
| QA-HTTP-13 | GET | /tickets/TKT-AF22AB85-2729-4D33-B9F2-53D0DD778098 | 403 | 403 | PASS |
| QA-HTTP-14 | PATCH | /tickets/TKT-AF22AB85-2729-4D33-B9F2-53D0DD778098/cancel | 403 | 403 | PASS |
| QA-HTTP-15 | GET | /tickets/TKT-AF22AB85-2729-4D33-B9F2-53D0DD778098 | 200 | 200 | PASS |
| QA-HTTP-16 | PATCH | /tickets/TKT-AF22AB85-2729-4D33-B9F2-53D0DD778098/use | 200 | 200 | PASS |
| QA-HTTP-17 | PATCH | /tickets/TKT-AF22AB85-2729-4D33-B9F2-53D0DD778098/use | 409 | 409 | PASS |
| QA-HTTP-18 | PATCH | /tickets/TKT-AF22AB85-2729-4D33-B9F2-53D0DD778098/cancel | 409 | 409 | PASS |
| QA-HTTP-19 | POST | /tickets | 201 | 201 | PASS |
| QA-HTTP-20 | PATCH | /tickets/TKT-284FF011-0B22-4607-AAF0-6DFFF74F3931/cancel | 200 | 200 | PASS |
| QA-HTTP-21 | GET | /tickets/TKT-284FF011-0B22-4607-AAF0-6DFFF74F3931 | 200 | 200 | PASS |
| QA-HTTP-22 | POST | /events | 201 | 201 | PASS |
| QA-HTTP-23 | PATCH | /events/QA-20261123133701-AGE/publish | 200 | 200 | PASS |
| QA-HTTP-24 | POST | /tickets | 409 | 409 | PASS |
| QA-HTTP-25 | POST | /events | 201 | 201 | PASS |
| QA-HTTP-26 | PATCH | /events/QA-20261123133701-CAPACITY/publish | 200 | 200 | PASS |
| QA-HTTP-27 | POST | /tickets | 201 | 201 | PASS |
| QA-HTTP-28 | POST | /tickets | 201 | 201 | PASS |
| QA-HTTP-29 | POST | /tickets | 409 | 409 | PASS |
| QA-HTTP-30 | GET | /events/QA-20261123133701-CAPACITY | 200 | 200 | PASS |

Invariantes adicionales registradas: el acceso y la cancelación ajenos devuelven403 y el ticket permanece PAID; cancelación legítima deja CANCELLED; capacidad agotada deja SOLD_OUT. El uso legítimo devuelve200 y su repetición409. La creación de estas entradas se realizó mediante los endpoints de negocio.

## Pendientes con alcance explícito

| Caso | Estado | Motivo |
|---|---|---|
| Expiración JWT y errores artificiales500/red en navegador | BLOCKED | Requieren ejecución controlada y evidencia específica; las pruebas MSW se identifican en la matriz |
| Correspondencia de los 50 criterios oficiales | Consultar matriz | La cobertura se contrasta por comportamiento y evidencia, no por el conteo global de 191 pruebas |


## Evidencia focalizada de filtros y accesibilidad

El [JSON primario](evidencias/07-accesibilidad/focused-results.json) registra seisPASS con API real: texto, categoría, artista, menú por Enter, contraste claro y oscuro. Tres controles tienen etiqueta asociada; no hubo overflow, errores JavaScript ni escrituras. Los18 muestreos por tema dieron mínimo6.27:1 claro y 7.66:1 oscuro. El método resuelve colores computados a sRGB mediante Canvas y composición alfa; excluye texto sobre gradientes. La limpieza de filtros fue parte del recorrido comunicado. Este alcance no certifica toda la interfaz.
