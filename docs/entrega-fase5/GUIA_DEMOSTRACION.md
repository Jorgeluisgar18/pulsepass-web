# Guion de presentación al profesor

## Preparación del propietario

Abrir la aplicación en `http://127.0.0.1:4173`. Consultar DATOS_DEMOSTRACION.md y el inventario local para seleccionar los códigos exactos. Recuperar credenciales mediante el mecanismo local DPAPI; no proyectar el archivo ni sus valores. Mantener una cuenta USER, STAFF y ADMIN disponibles. Los actores privilegiados también pueden incluir USER por el registro inicial: la interfaz debe respetar las reglas restrictivas cuando STAFF o ADMIN están presentes.

## Recorrido sugerido

| Paso | Acción | Resultado y efecto persistente |
|---|---|---|
| 1 | Inicio, cartelera y filtros | Eventos publicados, categorías y navegación; solo lectura |
| 2 | Detalle del evento, sede y artista | Datos asociados reales; solo lectura |
| 3 | Login USER_A y Cuenta | Identidad validada y perfil propio; autenticación |
| 4 | Comprar una entrada en evento destinado al recorrido | Confirmación y ticket propio; crea un registro permanente |
| 5 | Mis tickets y detalle | Código, estado, tipo y precio; solo lectura |
| 6 | Cancelar un PAID distinto de la entrada STAFF reservada | Estado CANCELLED; transición permanente |
| 7 | Login STAFF y búsqueda del PAID reservado para validación | Titular y estado; solo lectura hasta confirmar |
| 8 | Marcar usado y repetir la petición según el flujo disponible | USED y rechazo 409 de segundo uso; transición permanente |
| 9 | Login ADMIN, crear evento nuevo con código independiente | Validación y creación DRAFT; registro permanente |
| 10 | Asociar artista activo y publicar | Catálogo actualizado; cambios permanentes |
| 11 | Mostrar móvil y tema oscuro | Navegación y contenido responsive |
| 12 | Abrir índice de evidencias, resultados y matriz | Distinguir resultados actuales, históricos y pendientes |

## Conservación de los escenarios

No consumir anticipadamente el ticket PAID marcado `VALIDATION_PAID` en el inventario estable. Las repeticiones automatizadas de compra, cancelación, publicación y uso emplean prefijos QA con identificador de ejecución. Si una presentación ya consumió una transición, preparar otro registro controlado; no revertir silenciosamente el estado anterior. El guion describe operaciones para ejecutar en vivo, no afirma que todas hayan sido comprobadas desde botones en la auditoría actual.
