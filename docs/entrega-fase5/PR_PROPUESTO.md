# Propuesta definitiva de Pull Request

**Título:** `docs(delivery): auditoría y evidencias finales Fase 5 PulsePass`

Los enlaces de esta descripción apuntan a la rama preparada y serán accesibles tras publicarla; no se afirma que la rama remota ya exista.

## 1. Presentación académica

Estudiante: **Jorge Luis García Valderrama**. Docente: **Julián Pizarro**. Asignatura: **Programación Web**. Proyecto: **PulsePass**. Fase: **5 — Frontend con React, TypeScript y Tailwind CSS**. Fecha de entrega: **23 de noviembre de 2026**.

## 2. Resumen del proyecto

PulsePass permite descubrir eventos, consultar artistas y sedes y gestionar entradas mediante una aplicación web conectada a Spring Boot y PostgreSQL. Este PR organiza el cierre académico y las evidencias verificables del trabajo integrado, sin reconstruir las funcionalidades aprobadas.

## 3. Funcionalidades implementadas

Catálogo público con filtros y detalles; autenticación y perfil; compra, confirmación y gestión de tickets USER; consulta y validación de ingreso STAFF; creación, asociación de artistas y publicación ADMIN. Los permisos y la propiedad se validan en el backend.

## 4. Arquitectura

React y TypeScript con Tailwind CSS, React Router, TanStack Query, React Hook Form y Zod consumen la API Spring Boot. Spring Security controla autenticación y autorización; PostgreSQL conserva los recursos y Flyway versiona el esquema. [Informe de arquitectura y alcance](https://github.com/Jorgeluisgar18/pulsepass-web/blob/codex/entrega-fase5/docs/entrega-fase5/INFORME_FINAL.md).

## 5. Datos de demostración

La base local contiene 4 sedes, 8 eventos estables —6 publicados—, 5 actores funcionales y tickets PAID/CANCELLED/USED. Se conserva un PAID para la presentación STAFF y se separan los registros QA por ejecución. Las credenciales están cifradas localmente fuera de Git. [Inventario y procedimientos](https://github.com/Jorgeluisgar18/pulsepass-web/blob/codex/entrega-fase5/docs/entrega-fase5/DATOS_DEMOSTRACION.md). El repositorio no transporta automáticamente la base.

## 6. Pruebas automatizadas

La regresión final actual registró **203/203 Vitest** en 32 archivos, ESLint y build TypeScript/Vite correctos. Los logs primarios están en evidencias/10-calidad-actual. Los conteos **161/161**, **191/191** y **196/196** corresponden a auditorías históricas previas. [Resultados y alcance](https://github.com/Jorgeluisgar18/pulsepass-web/blob/codex/entrega-fase5/docs/entrega-fase5/RESULTADOS_CALIDAD.md).

## 7. Pruebas funcionales reales

La evidencia QA registra **30/30 respuestas HTTP esperadas**. Chrome ejecutó las operaciones principales sobre registros QA: creación, asociación, publicación, dos compras, cancelación y uso, con **7 respuestas esperadas** y cero errores JavaScript registrados. Se conservan 80 controles públicos y 7 autenticados de lectura. [Pruebas y evidencia primaria](https://github.com/Jorgeluisgar18/pulsepass-web/blob/codex/entrega-fase5/docs/entrega-fase5/PRUEBAS_FUNCIONALES.md).

## 8. Lighthouse

El resultado Mobile **97/100/100/82** es histórico y corresponde a Inicio antes del catálogo poblado. Existe ahora un [reporte Mobile actual con datos](https://github.com/Jorgeluisgar18/pulsepass-web/blob/codex/entrega-fase5/docs/entrega-fase5/evidencias/10-calidad-actual/lighthouse-mobile.report.html), con **100/100/100/82** —Performance, Accessibility, Best Practices y SEO—. Su configuración, fecha y métricas están en RESULTADOS_CALIDAD.md. SEO permanece sin cambios; Accessibility 100 no equivale a certificación WCAG.

## 9. Evidencias visuales

Se conservan las **101 capturas originales del navegador** y se añade evidencia nueva. Las32 referencias extraídas del PDF se distinguen de las capturas de la aplicación; el total PNG no equivale a pruebas completas. Cubren cuatro viewports y temas claro/oscuro. Los manifiestos distinguen rutas, roles, controles visuales, respuestas API e interacciones. [Evidencias](https://github.com/Jorgeluisgar18/pulsepass-web/blob/codex/entrega-fase5/docs/entrega-fase5/evidencias/) y [auditoría visual](https://github.com/Jorgeluisgar18/pulsepass-web/blob/codex/entrega-fase5/docs/entrega-fase5/AUDITORIA_VISUAL.md).

## 10. Matriz del PRD

La [matriz de cumplimiento](https://github.com/Jorgeluisgar18/pulsepass-web/blob/codex/entrega-fase5/docs/entrega-fase5/MATRIZ_CUMPLIMIENTO_PRD.md) contrasta el PDF original de 63 páginas, especialmente las secciones 8, 9, 10, 13, 21, 29 y 30. Conserva los estados PARCIAL y NO VERIFICADO cuando falta evidencia; el número total de pruebas no acredita automáticamente todos los criterios oficiales.

## 11. Ejecución reproducible

La [guía de ejecución](https://github.com/Jorgeluisgar18/pulsepass-web/blob/codex/entrega-fase5/docs/entrega-fase5/GUIA_EJECUCION.md) documenta requisitos, puertos, variables y comandos. Los scripts comprueban el destino antes de escribir y mantienen registros QA separados. El ambiente local verificado usa frontend 4173, backend 8080 y PostgreSQL 5433/pulsepass; el E2E 5434 es independiente.

## 12. Guion de presentación

La [guía de demostración](https://github.com/Jorgeluisgar18/pulsepass-web/blob/codex/entrega-fase5/docs/entrega-fase5/GUIA_DEMOSTRACION.md) ordena el recorrido público, USER, STAFF, ADMIN y calidad. Identifica las operaciones persistentes y conserva el ticket reservado hasta la presentación. El [índice](https://github.com/Jorgeluisgar18/pulsepass-web/blob/codex/entrega-fase5/docs/entrega-fase5/README_ENTREGA.md) permite preparar posteriormente un PDF académico complementario.

## 13. Limitaciones conocidas

1. Las32 referencias fueron inspeccionadas, pero persisten diferencias y criterios PARCIAL/NO VERIFICADO; no se declara equivalencia integral.
2. Algunas pantallas conservan diferencias visuales documentadas.
3. La revisión WCAG 2.1 AA no es una certificación integral.
4. Lighthouse actual cubre Inicio poblado en Mobile; no acredita todas las rutas ni todos los dispositivos.
5. El 97/100/100/82 corresponde a la medición histórica inicial.
6. La API no dispone de listado administrativo global de eventos.
7. Los datos persistidos están en PostgreSQL local del estudiante.
8. Los procedimientos reproducen el ambiente, pero Git no transporta la base automáticamente.

[Detalle y feedback](https://github.com/Jorgeluisgar18/pulsepass-web/blob/codex/entrega-fase5/docs/entrega-fase5/LIMITACIONES_Y_FEEDBACK.md).

## 14. Referencias a entregas anteriores

- [PR frontend #4](https://github.com/Jorgeluisgar18/pulsepass-web/pull/4).
- [PR frontend #5](https://github.com/Jorgeluisgar18/pulsepass-web/pull/5).
- [Repositorio frontend](https://github.com/Jorgeluisgar18/pulsepass-web).
- [Repositorio backend](https://github.com/Jorgeluisgar18/pulsepass).

Referencia integrada conocida: main `11d18f5`. Preparación local en `codex/entrega-fase5`.

## 15. Solicitud de revisión docente

Se solicita al profesor Julián Pizarro revisar funcionalidades, arquitectura, trazabilidad, experiencia visual y evidencias, y proporcionar retroalimentación sobre las brechas conservadas. Este documento deja preparada la descripción del PR; no crea commit, push ni PR. La publicación requiere aprobación expresa del propietario y no se realizará merge automático.
