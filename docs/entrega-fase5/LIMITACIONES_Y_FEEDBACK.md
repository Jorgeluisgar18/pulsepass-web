# Limitaciones y puntos para retroalimentación

| Asunto | Evidencia disponible / límite | Siguiente comprobación |
|---|---|---|
| Listado administrativo completo | GAP01 del PRD: el backend no expone listado general | Mantener búsqueda por código y creados de sesión; no inventar endpoint |
| Cobertura oficial | Las pruebas totales no equivalen automáticamente a los 50 criterios oficiales | Revisar la correspondencia de la matriz; los criterios visuales aún requieren aceptación docente donde está señalado |
| Lighthouse actual | Reporte Mobile de Inicio poblado 100/100/100/82; histórico inicial 97/100/100/82 conservado | No extrapolar la medición a otras rutas/dispositivos |
| Errores artificiales | 500 y red deben probarse con mocks controlados | Identificar pruebas Vitest/MSW y no presentarlas como caída real del backend |
| Errores de autenticación | Respuestas 200/201 válidas e inválidas, HTTP 401 y salida segura de Zod fueron verificadas | NFR-FE-006 se considera cumplido; mantener `AuthApiErrors.test.ts` y `http.test.ts` en la regresión |
| Notificaciones y modo oscuro | Avisos por roles, variantes dark y alternador accesible fueron verificados con Vitest/MSW y navegador | Mantener las pruebas focalizadas; no consumir datos demo en verificaciones manuales |
| Estado local | La documentación y evidencias están preparadas localmente | Revisar inventario Git y secretos antes de autorización de publicación |

Los estados pendientes no se convierten en PASS por la existencia del componente ni por una captura. Se solicita retroalimentación docente sobre consistencia visual, claridad de estados, experiencia móvil y suficiencia de evidencias. SEO se conserva por decisión expresa del propietario.


## Alcance actualizado

Las mutaciones principales fueron realizadas desde el navegador:7 respuestas esperadas y11 capturas. El segundo uso409 y la privacidad se acreditan por API, sin deducir su presentación UI. Las32 referencias fueron inspeccionadas según AUDITORIA_VISUAL.md; las diferencias, adaptaciones y limitaciones se mantienen por fila, sin extrapolar equivalencia completa. La revisión focalizada acredita filtros, teclado del menú, etiquetas 3/3 y18 muestras de contraste por tema; axe se incorporó después en una ejecución automatizada identificada. Axe actual no encontró violaciones en 36 casos públicos y 14 autenticados, pero existen comprobaciones incompletas que requieren revisión manual. La accesibilidad no se declara certificada; Lighthouse actual se limita a Inicio poblado.


## Limitaciones oficiales conservadas para la revisión docente

1. Se inspeccionaron las 32 referencias del PRD; los resultados parciales y los aspectos no verificables permanecen explícitos.
2. Existen diferencias visuales documentadas en algunas pantallas.
3. La revisión WCAG 2.1 AA no constituye una certificación completa.
4. El nuevo informe Lighthouse cubre Inicio poblado en Mobile; no reemplaza mediciones de todas las rutas y dispositivos.
5. Lighthouse 97/100/100/82 es histórico y corresponde a la medición inicial.
6. La API no ofrece un listado administrativo global de eventos.
7. Los datos preparados permanecen en PostgreSQL local del estudiante.
8. El repositorio ofrece procedimientos reproducibles, pero no transporta automáticamente la base de datos.

El propósito del PR es la revisión y retroalimentación de Julián Pizarro para la entrega de Jorge Luis García Valderrama, no declarar certificación integral del sistema.
