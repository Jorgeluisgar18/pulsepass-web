# Resultados de calidad

Fecha de referencia: 23 de noviembre de 2026. Estudiante: Jorge Luis García Valderrama. Docente: Julián Pizarro. Fase 5 — Frontend con React, TypeScript y Tailwind CSS. Se distingue la auditoría previa de las verificaciones actuales.

## Regresión final actual

| Comando | Resultado observado | Evidencia primaria |
|---|---|---|
| npm test |203/203 pruebas en 32 archivos; salida 0; duración 17.72 s |[Vitest](evidencias/10-calidad-actual/vitest-final.txt)|
| npm run lint | Sin errores ni advertencias; salida 0 |[ESLint](evidencias/10-calidad-actual/lint-final.txt)|
| npm run build | TypeScript y Vite correctos; salida 0 |[Build](evidencias/10-calidad-actual/build-final.txt)|

Bloque 41: las pruebas relacionadas con autenticación y HTTP aprobaron 77/77 en 6 archivos; la prueba nueva `AuthApiErrors.test.ts` aprobó 5/5.

Bloque 42: las pruebas focalizadas aprobaron 32/32 en tema, avisos y flujos 409. La regresión actual conserva histórico 196/196 y 191/191.

La auditoría previa tuvo 161/161 pruebas. El aumento refleja cobertura añadida: Navbar por roles, cancelación oculta para RESERVED/USED/CANCELLED, secuencia de uso y conflicto del cliente API, y publicación visible en el catálogo real. `Date` está fijado en el setup (Date.now y new Date) y se conservan temporizadores reales; la expiración corta de sesión fue comprobada en las pruebas focalizadas. No son pruebas con PostgreSQL ni un sustituto del navegador real.

## Navegador y API real conservados

| Lote | Resultado / alcance | Evidencia |
|---|---|---|
| Público |80 controles de renderizado/overflow en 360, 390, 768 y 1280 px, claro/oscuro |[JSON](evidencias/public-browser-results.json)|
| Autenticado |7 pantallas de lectura en 390 px |[JSON](evidencias/roles-readonly-results.json)|
| Reglas QA API |30 códigos HTTP esperados y propiedad/estado |[JSON](evidencias/qa-business-results.json)|
| Mutaciones UI |7 respuestas esperadas,11 estados capturados, cero errores JavaScript |[JSON](evidencias/ui-business-results.json)|
| Filtros/teclado/contraste |6 PASS; etiquetas 3/3; 18 muestras por tema, mínimos 6.27:1 claro y 7.66:1 oscuro; excluye gradientes |[JSON](evidencias/07-accesibilidad/focused-results.json)|

El lote original contiene 101 capturas del navegador. La ampliación añade capturas de la aplicación y 32 imágenes de referencia extraídas del PRD: las fuentes se distinguen en los manifiestos. Un total de PNG no equivale a pruebas funcionales.

## Axe actual y corrección acotada

[Axe público](evidencias/10-calidad-actual/axe-public.json): 36 casos, cero violaciones reportadas y 8 comprobaciones incompletas registradas, que requieren inspección manual. [Axe por roles](evidencias/10-calidad-actual/axe-roles.json): 14 casos, cero violaciones. No se declara certificación WCAG 2.1 AA completa.

La ejecución anterior detectó contraste insuficiente en el detalle TECHNOLOGY oscuro. El cambio productivo se limita a dos clases `dark:text-marca-500`→`dark:text-marca-300` en DetalleEventoCabecera; el [resultado previo](evidencias/10-calidad-actual/axe-public-before-fix.json) se conserva para trazabilidad. No se modificaron contratos, permisos ni lógica de compra. Los resultados actuales corresponden a Chrome y las versiones de herramientas registradas en sus reportes; no acreditan compatibilidad exhaustiva con todos los navegadores o lectores de pantalla.

## Lighthouse: histórico y actual

| Medición | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Histórica, Inicio inicialmente vacío |97|100|100|82|
| Actual, Inicio con catálogo poblado |100|100|100|82|

La medición histórica comunicada por el propietario tuvo FCP 1.9 s, LCP 1.9 s, TBT 110 ms, CLS 0 y Speed Index 1.9 s. No se reutiliza como medición nueva.

El reporte actual se conserva en [HTML](evidencias/10-calidad-actual/lighthouse-mobile.report.html) y [JSON](evidencias/10-calidad-actual/lighthouse-mobile.report.json). Es una medición Mobile de `http://127.0.0.1:4173/`; el JSON primario registra fecha, emulación, Chrome y versión Lighthouse. Una puntuación Accessibility 100 y un axe sin violaciones no certifican todo WCAG. No se modificó SEO.

## Integridad y límites

La revisión documental valida enlaces y separa capturas reales de referencias PDF, pruebas MSW de HTTP real y resultados históricos de actuales. La comparación visual completa y los estados que la matriz conserve PARCIAL/NO VERIFICADO no se convierten en aprobados por estos conteos. La base permanece local y el repositorio contiene procedimientos, no una copia automática de PostgreSQL. No se ejecutó commit, push ni PR.

Medición actual registrada: fetchTime `2026-11-23T21:06:11.807Z`; FCP/LCP/TBT/CLS/Speed Index, respectivamente: **0.8Â s; 0.8Â s; 10Â ms; 0; 0.8Â s**.


## Cobertura de estados de datos añadida

`EstadosDatos.test.tsx` contiene16 casos con páginas React reales, AuthProvider y MSW: carga pendiente controlada, HTTP500, reintento y recuperación en catálogo, artistas, sedes, detalles, Inicio, Cuenta, tickets, confirmación y consultas ADMIN/STAFF; estados vacíos cuando corresponden al contrato. Los recursos individuales no se fuerzan a aceptar respuestas vacías inválidas. Las páginas estáticas o de formulario sin consulta automática no requieren fabricar una carga inexistente. Se conserva la trazabilidad por pantalla en la matriz; esta cobertura de componentes no equivale a una nueva ejecución PostgreSQL.

La primera compilación de este refuerzo detectó un tipo unknown incompatible con MSW en el test nuevo. Se corrigió a JsonBodyType sin relajar aserciones; el log [del diagnóstico](evidencias/10-calidad-actual/build-type-failure-before-fix.txt) se conserva y el build final terminó correctamente.
