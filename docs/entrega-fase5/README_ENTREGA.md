# Entrega académica — PulsePass

**Estudiante:** Jorge Luis García Valderrama. **Docente:** Julián Pizarro.
**Asignatura:** Programación Web. **Proyecto:** PulsePass.
**Fase:** 5 — Frontend con React, TypeScript y Tailwind CSS.
**Fecha de entrega:** 23 de noviembre de 2026.

Fuente normativa: PulsePass_PRD_Original.pdf, 63 páginas. Referencia funcional integrada: main `11d18f5`. Rama de preparación: `codex/entrega-fase5`.

## Índice de revisión

| Documento | Función |
|---|---|
| [Informe final](INFORME_FINAL.md) | Alcance y resultados académicos |
| [Matriz PRD](MATRIZ_CUMPLIMIENTO_PRD.md) | Trazabilidad y brechas por requisito |
| [Pruebas funcionales](PRUEBAS_FUNCIONALES.md) | Recorridos ejecutados y resultados |
| [Auditoría visual](AUDITORIA_VISUAL.md) | Referencias del PRD y responsive |
| [Calidad](RESULTADOS_CALIDAD.md) | Pruebas, compilación y mediciones |
| [Inventario](DATOS_DEMOSTRACION.md) | Registros persistentes y separación QA |
| [Ejecución](GUIA_EJECUCION.md) | Preparación reproducible y puertos |
| [Guion](GUIA_DEMOSTRACION.md) | Secuencia de presentación al profesor |
| [Limitaciones](LIMITACIONES_Y_FEEDBACK.md) | Casos pendientes y retroalimentación |
| [Propuesta de PR](PR_PROPUESTO.md) | Descripción lista para revisión local |

Las capturas y los JSON primarios están en [evidencias](evidencias/). Una captura acredita el estado observado, no todas las interacciones de la pantalla. Las pruebas API reales se distinguen de las pruebas Vitest con MSW. Esta entrega no constituye una certificación WCAG.



## Acceso para la presentación académica

El paquete conserva 101 capturas PNG reales; no equivalen a 101 pruebas completas. Para localizar Inicio, catálogo, autenticación, compra, tickets, STAFF, ADMIN, responsive y modo oscuro, consultar PRUEBAS_FUNCIONALES.md y los manifiestos de evidencias. Arquitectura y resultados están en el informe y RESULTADOS_CALIDAD.md. El PDF académico complementario se preparará posteriormente; no forma parte de esta tarea.

Los datos persistidos permanecen en PostgreSQL local del estudiante. Los procedimientos permiten reproducir el ambiente y los actores, pero Git no transporta automáticamente la base de datos. Consultar las limitaciones antes de evaluar la preparación integral.
