# Informe final — PulsePass

**Estudiante:** Jorge Luis García Valderrama.
**Asignatura:** Programación Web.
**Docente:** Julián Pizarro.
**Proyecto:** PulsePass.
**Fase:** 5 — Frontend con React, TypeScript y Tailwind CSS.
**Fecha de entrega:** 23 de noviembre de 2026.

## Objetivo y alcance

Preparar una aplicación que permita al profesor consultar catálogo, artistas y sedes; autenticarse; gestionar entradas; validar ingresos y administrar eventos. El PRD original de 63 páginas constituye la referencia. Se auditan especialmente las secciones 8, 9, 10, 13, 21, 29 y 30. No se reconstruyeron las funcionalidades integradas en los PR #4 y #5.

## Arquitectura e implementación

El navegador ejecuta React y TypeScript, con Tailwind CSS, React Router, TanStack Query, React Hook Form y Zod. El cliente HTTP consume la API Spring Boot; Spring Security aplica autenticación, roles y propiedad de recursos. PostgreSQL persiste usuarios, roles, credenciales BCrypt, perfiles, sedes, artistas, eventos y tickets. Flyway V1–V4 figura aplicado correctamente.

Los contratos y las reglas de negocio permanecen en el backend. USER compra y consulta sus entradas; STAFF valida ingresos; ADMIN crea, asocia artistas y publica eventos. El listado administrativo completo no existe en el contrato: la interfaz ofrece búsqueda por código y relación de eventos creados durante la sesión.

## Preparación de la presentación

Se verificó el frontend `127.0.0.1:4173`, backend `127.0.0.1:8080` y su conexión a `pulsepass` mediante el puerto host 5433. La carga autorizada es aditiva: conserva datos existentes, comprueba la base y separa registros estables de registros QA para las transiciones. Las credenciales se conservan cifradas mediante DPAPI fuera del repositorio.

## Resultados observados

- Regresión final actual: **203/203 pruebas en 32 archivos**, ESLint y build correctos, con logs primarios actualizados en 10-calidad-actual. Los resultados 196/196, 191/191 y 161/161 se conservan como históricos previos.

- Navegador Chrome con API real: 80 controles de páginas públicas en 360, 390, 768 y 1280 px, con temas claro y oscuro; sin desbordamiento horizontal ni errores JavaScript registrados.

- Navegador autenticado: 7 controles de páginas USER, STAFF y ADMIN en 390 px, con login real y sin mutaciones en ese recorrido.

- API real QA: 30 respuestas con los códigos esperados, incluyendo creación, publicación, compra, cancelación, propiedad, uso repetido, edad y capacidad. Adicionalmente se ejecutaron desde la interfaz creación, asociación, publicación, dos compras, cancelación y uso:7 respuestas esperadas,11 capturas y cero errores JavaScript; véase ui-business-results.json.

El lote previo de **101 capturas PNG del navegador** se conserva y se ha ampliado. El total actual también incluye imágenes de referencia extraídas del PDF: no debe presentarse como un conteo de pruebas funcionales ni como capturas exclusivamente del navegador. Los manifiestos distinguen controles visuales, respuestas API e interacciones de navegador.

## Limitaciones y conclusiones

Los resultados permiten demostrar que el frontend se conecta al backend real y que las principales reglas de negocio responden con datos persistentes. No prueban por sí solos los 50 casos oficiales ni la equivalencia de las 32 referencias visuales. Los pendientes detallados en la matriz y el documento de limitaciones deben conservarse visibles hasta disponer de evidencia. Lighthouse histórico se informa por separado; no se modificó SEO.

## Repositorios

- Frontend: https://github.com/Jorgeluisgar18/pulsepass-web

- Backend: https://github.com/Jorgeluisgar18/pulsepass

Los datos permanecen en PostgreSQL local del estudiante; los scripts permiten reproducirlos, pero el repositorio no transporta automáticamente la base. La propuesta de entrega requiere revisión del propietario antes de commit, push o apertura del PR.
