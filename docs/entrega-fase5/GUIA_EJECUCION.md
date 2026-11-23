# Guía de ejecución

## Requisitos

Node.js 22.22 o superior, npm, Java compatible con el backend, Docker Desktop y PostgreSQL. Consultar los README de ambos repositorios para sus versiones y configuración. No incorporar secretos a archivos versionados; el frontend documenta `VITE_API_BASE_URL=/api` en `.env.example`.

## Entorno verificado

| Servicio | Dirección / nombre |
|---|---|
| Frontend Vite Preview | http://127.0.0.1:4173 |
| Backend Spring Boot | http://127.0.0.1:8080 |
| PostgreSQL principal | pulsepass-postgres, host 5433, base pulsepass |
| PostgreSQL E2E separado | pulsepass-e2e-postgres, host 5434, base pulsepass_e2e |

No ejecutar `seed-e2e.sql` en la base principal. Los servicios existentes no necesitan reiniciarse para consultar la aplicación o repetir la carga aditiva.

## Preparación en un entorno nuevo

1. Preparar PostgreSQL y las variables privadas del backend siguiendo su documentación. Verificar el nombre de base y puerto antes de aplicar Flyway.

2. Iniciar el backend y confirmar los GET públicos de artistas, sedes y eventos publicados.

3. En frontend instalar las dependencias declaradas con `npm ci`, compilar con `npm run build` e iniciar `npm run preview -- --host 127.0.0.1 --port 4173`.

4. Confirmar que `/api` desde el navegador llega al backend correcto. La configuración de proxy se documenta en `vite.config.ts`; no colocar claves de backend en variables VITE.

5. Leer y ejecutar `scripts/Prepare-Demo.ps1` únicamente en la base autorizada. El script verifica la identidad de la base, usa registro público y aprovisionamiento local controlado para actores nuevos. Su repetición no debe resetear estados ni sobreescribir identidades existentes.

6. Las contraseñas se generan localmente y se conservan cifradas con DPAPI para el usuario de Windows propietario. No copiarlas al repositorio ni a las capturas.

## Verificación y resolución de problemas

Ejecutar `npm test`, `npm run lint` y `npm run build`. Si aparece un catálogo vacío, consultar `/api/events/published` y `/api/venues/active` antes de alterar la interfaz. Si hay 401, revisar sesión/autenticación; 403 implica falta de permiso o propiedad. Un puerto E2E no debe sustituirse por el principal sin verificar la conexión. Si un código de carga ya existe con otra identidad, detener la carga e investigar; no borrar ni restablecer registros para hacerla pasar.
