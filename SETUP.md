# Vectorify - Setup Guide

Este documento te guiará paso a paso para configurar y ejecutar Vectorify en tu máquina local.

## Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Docker** y **Docker Compose** (para la base de datos)

### Instalación de pnpm

Si no tienes pnpm instalado:

```bash
npm install -g pnpm
```

## Paso 1: Instalar Dependencias

Desde la raíz del proyecto:

```bash
pnpm install
```

Esto instalará todas las dependencias del monorepo (backend, frontend y paquetes compartidos).

## Paso 2: Configurar Variables de Entorno

Los archivos `.env` ya están creados con valores por defecto para desarrollo local. Si deseas cambiar algo:

- `packages/db/.env` - Configuración de base de datos para Prisma
- `apps/api/.env` - Configuración del backend
- `apps/web/.env.local` - Configuración del frontend

## Paso 3: Levantar la Base de Datos

Inicia PostgreSQL y Redis con Docker Compose:

```bash
docker-compose up -d
```

Verifica que los contenedores estén corriendo:

```bash
docker ps
```

Deberías ver `vectorify-postgres` y `vectorify-redis` en la lista.

## Paso 4: Generar Cliente de Prisma e Inicializar la Base de Datos

```bash
# Generar el cliente de Prisma
pnpm --filter @vectorify/db db:generate

# Push del esquema a la base de datos (crea las tablas)
pnpm db:push
```

## Paso 5: (Opcional) Seed de Datos Demo

Para poblar la base de datos con datos de ejemplo:

```bash
pnpm --filter @vectorify/db db:seed
```

Esto creará:
- Un usuario demo: `demo@vectorify.io`
- Un workspace demo: `demo-workspace`
- Un proyecto demo: `demo-startup`
- Estructura de carpetas del stack YC Startup

## Paso 6: Ejecutar la Aplicación

### Opción A: Ejecutar todo en paralelo (Recomendado)

```bash
pnpm dev
```

Esto iniciará:
- **Backend (API)** en `http://localhost:3001`
- **Frontend (Web)** en `http://localhost:3000`

### Opción B: Ejecutar servicios por separado

Terminal 1 - Backend:
```bash
pnpm --filter @vectorify/api dev
```

Terminal 2 - Frontend:
```bash
pnpm --filter @vectorify/web dev
```

## Paso 7: Verificar que Todo Funcione

1. **Backend API**: Abre `http://localhost:3001/api/docs`
   - Verás la documentación Swagger de la API

2. **Frontend**: Abre `http://localhost:3000`
   - Verás la landing page de Vectorify

3. **Workspace**: Navega a `http://localhost:3000/workspace`
   - Verás el IDE de Vectorify con el layout completo

## Comandos Útiles

```bash
# Ver logs de la base de datos
docker-compose logs -f postgres

# Detener la base de datos
docker-compose down

# Limpiar todo (incluye volúmenes)
docker-compose down -v

# Ver Studio de Prisma (GUI para la DB)
pnpm db:studio

# Limpiar node_modules y reconstruir
pnpm clean
pnpm install
pnpm build

# Ejecutar migraciones de Prisma
pnpm db:migrate
```

## Solución de Problemas

### Error: "Cannot connect to database"

1. Verifica que Docker esté corriendo: `docker ps`
2. Verifica que el contenedor de Postgres esté activo
3. Revisa el `DATABASE_URL` en los archivos `.env`

### Error: "Module not found" en imports

1. Reconstruye el monorepo: `pnpm install`
2. Genera el cliente de Prisma: `pnpm --filter @vectorify/db db:generate`

### Puerto 3000 o 3001 ya en uso

Cambia el puerto en:
- Backend: `apps/api/.env` → variable `PORT`
- Frontend: `pnpm --filter web dev -- -p 3002`

## Próximos Pasos

Una vez que tengas todo funcionando:

1. **Explora el código**: Revisa la arquitectura en `apps/api/src` y `apps/web/src`
2. **Crea un proyecto**: Ve a `/workspace/new` y crea tu primer proyecto
3. **Lee la documentación de arquitectura**: `ARCHITECTURE.md`

---

Si tienes problemas, revisa los logs de la terminal o abre un issue en el repositorio.
