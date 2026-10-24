# Tickets Web

Frontend para administrar tickets de compra. Es la parte web de la prueba técnica de CFG y consume la API del repositorio `tickets-api`.

## Tecnologías

- React 19 con TypeScript y Vite
- Tailwind CSS (el diseño parte de la plantilla TailAdmin)
- React Router y Axios
- Heroicons para los iconos y SweetAlert2 para las alertas

## Cómo correrlo

Primero hay que tener la API andando (mira el README de `tickets-api`).

1. Instalar dependencias:

```bash
npm install
```

2. Arrancar:

```bash
npm run dev
```

Se abre en `http://localhost:5173`. Las llamadas a `/api` se mandan solas a `http://localhost:3000` (está configurado en `vite.config.ts`).

Si la API está en otra dirección, se puede cambiar con la variable `VITE_API_URL` (para la compilación) o `VITE_PROXY_TARGET` (para el servidor de desarrollo).

Otros comandos:

```bash
npm run build
npm run lint
```

## Qué se puede hacer

- **Login** con correo y contraseña. El administrador de prueba es `admin@example.com`.
- **Tickets**: listado con búsqueda, filtros y paginación. Crear, editar (con sus líneas) y eliminar. Eliminar solo lo ve el administrador.
- **Pagos**: se elige una semana y se ven los pagos por proveedor con el detalle de tickets y líneas.
- **Importar** (solo administrador): se sube el Excel, se revisa lo que va a pasar, se deciden los conflictos y se confirma dos veces antes de guardar.
- Modo claro y oscuro.

La base de datos empieza vacía, así que lo primero es entrar como administrador e importar el Excel de ejemplo que está en `tickets-api/database/data/tickets-prueba.xlsx`.

## Estructura

```
src/
  api/          llamadas a la API (axios)
  components/   componentes de interfaz
  context/      sesión y tema
  hooks/        lógica de las pantallas
  interfaces/   tipos de TypeScript
  layout/       menú lateral y cabecera
  pages/        las pantallas
  utils/        funciones auxiliares
```

## Notas

- La sesión se guarda con un token en el navegador. Si el token vence, vuelve al login.
- Los textos de la interfaz y los mensajes de error están en español.
