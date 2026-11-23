# PulsePass Web

Frontend web de **PulsePass**, plataforma académica para descubrir eventos, consultar artistas y sedes, gestionar entradas y ejecutar operaciones según los roles `USER`, `STAFF` y `ADMIN`.

Este proyecto corresponde a la fase de **Frontend con React, TypeScript y Tailwind CSS** y consume la API REST segura desarrollada previamente con Spring Boot.

## Tecnologías

- Node.js 22.22+
- Vite
- React 19
- TypeScript con modo estricto
- Tailwind CSS v4
- React Router v8
- TanStack Query
- React Hook Form
- zod
- Vitest
- Testing Library
- MSW
- ESLint
- Prettier

## Requisitos

- Node.js 22.22 o superior
- npm
- Backend PulsePass disponible en `http://localhost:8080`

## Instalación

```bash
npm install
```

## Variables de entorno

El proyecto incluye `.env.example`:

```env
VITE_API_BASE_URL=/api
```

No deben almacenarse contraseñas, tokens JWT ni otros secretos en archivos versionados.

Durante el desarrollo, Vite redirige las solicitudes `/api` hacia:

```text
http://localhost:8080
```

## Comandos

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Ejecutar las pruebas:

```bash
npm test
```

Ejecutar ESLint:

```bash
npm run lint
```

Generar el build de producción:

```bash
npm run build
```

## Roles de la aplicación

### Visitante

Puede consultar:

- Inicio
- Eventos
- Artistas
- Sedes
- Login
- Registro

### USER

Puede además:

- Consultar su cuenta
- Comprar entradas
- Consultar sus tickets
- Ver el detalle de sus tickets
- Cancelar tickets permitidos por el backend

### STAFF

Puede además:

- Validar el ingreso mediante código de ticket
- Consultar tickets pagados de un evento

### ADMIN

Puede además:

- Crear eventos
- Consultar eventos por código
- Publicar eventos
- Asociar artistas
- Ejecutar las operaciones permitidas para STAFF

La interfaz únicamente controla la experiencia de navegación. La autorización real siempre pertenece al backend.

## Rutas principales

```text
/
├── /eventos
│   └── /eventos/:eventCode
├── /artistas
│   └── /artistas/:id
├── /sedes
│   └── /sedes/:code
├── /login
├── /registro
├── /cuenta
├── /mis-tickets
│   └── /mis-tickets/:ticketCode
├── /compra/confirmacion/:ticketCode
├── /staff/validacion
├── /staff/eventos/:eventCode/tickets
├── /admin/eventos
├── /admin/eventos/nuevo
├── /admin/eventos/:eventCode
└── /403
```

Las rutas desconocidas muestran la página 404.

## Principios de implementación

- Los datos externos se validan con `zod`.
- Los tipos derivados de contratos HTTP utilizan `z.infer`.
- Los datos del servidor se administran con TanStack Query.
- No se utiliza `useEffect + fetch` para cargar datos de servidor.
- No se utiliza Axios.
- No se utiliza `react-router-dom`.
- El enrutamiento utiliza `createBrowserRouter` y `RouterProvider`.
- No se utiliza `React.FC`.
- No se utiliza `any`.
- Las clases Tailwind no se construyen dinámicamente.
- El JWT nunca se almacena en `localStorage`.
- El JWT nunca se envía mediante URL.
- Las reglas de negocio permanecen en el backend.
- Los errores de la API se representan mediante un contrato uniforme en la interfaz.
- La aplicación es mobile-first y tiene como objetivo WCAG 2.1 AA.

## Estructura principal

```text
src/
├── componentes/
├── funcionalidades/
├── layouts/
├── lib/
├── pages/
├── test/
├── main.tsx
├── router.tsx
└── index.css
```

La estructura se completa de forma incremental conforme avanza la implementación.

## Estado actual

**MVP frontend implementado:**

- Mapa de rutas con lazy loading, vistas 403/404 y navegación por rol.
- Inicio, cartelera con filtros y detalles de eventos, artistas y sedes.
- Registro, login JWT, restauración de sesión, perfil propio y guardas de autorización.
- USER: selección y compra de tickets, confirmación, lista, detalle y cancelación.
- STAFF: validación de ingreso y consulta de tickets pagados por evento.
- ADMIN: búsqueda, creación, publicación de eventos y asociación de artistas.
- Integración HTTP con validación Zod, manejo de estados y errores de la API.
- Pruebas unitarias y de interacción con Vitest, Testing Library y MSW.
- Diseño responsive y modo oscuro automático según la preferencia del dispositivo.

**Limitaciones conocidas:**

- El backend no proporciona un listado administrativo completo de eventos: se permite la búsqueda por código y se mantiene una lista de los eventos creados durante la sesión.
- No se incluye pasarela de pago real ni QR, fuera del alcance obligatorio del PRD.
- La conformidad total WCAG AA y la meta Lighthouse Performance de Inicio requieren mediciones finales con axe/Lighthouse y revisión manual. No se declaran certificadas por las pruebas unitarias.
## Calidad

Antes de integrar un cambio se deben ejecutar:

```bash
npm test
npm run lint
npm run build
```

Los tres comandos deben finalizar correctamente.

---

PulsePass es un caso de estudio académico. El frontend presenta y orquesta las interacciones; el backend decide y protege las reglas de negocio.