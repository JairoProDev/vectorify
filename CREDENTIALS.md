# 🔐 Credenciales y Configuración de Vectorify

## 📋 Credenciales de Base de Datos

Las credenciales de PostgreSQL están configuradas en `docker-compose.yml` y se han creado automáticamente en los archivos `.env`.

### PostgreSQL (Docker)

- **Usuario:** `vectorify`
- **Contraseña:** `vectorify_dev_password`
- **Base de datos:** `vectorify_dev`
- **Puerto:** `5433` (mapeado desde 5432 del contenedor)
- **Host:** `localhost`
- **URL de conexión:** `postgresql://vectorify:vectorify_dev_password@localhost:5433/vectorify_dev`

### Redis (Docker)

- **Puerto:** `6379`
- **Host:** `localhost`
- **URL de conexión:** `redis://localhost:6379`

## 🚀 Inicio Rápido

### 1. Levantar servicios con Docker

```bash
docker-compose up -d
```

### 2. Configurar variables de entorno

```bash
./scripts/setup-env.sh
```

Este script crea automáticamente:
- `.env` en la raíz del proyecto
- `.env` en `apps/api/`
- `.env.local` en `apps/web/`

### 3. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

## 📁 Archivos de Configuración

Los archivos `.env` contienen:

### Raíz del proyecto (`/.env`)
```env
DATABASE_URL=postgresql://vectorify:vectorify_dev_password@localhost:5433/vectorify_dev
PORT=3004
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

### Backend (`apps/api/.env`)
```env
DATABASE_URL=postgresql://vectorify:vectorify_dev_password@localhost:5433/vectorify_dev
PORT=3004
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3004/api/v1
```

## 🔧 Puertos del Sistema

- **Frontend (Next.js):** `3000-3003` (automático, el primero disponible)
- **Backend API (NestJS):** `3004`
- **PostgreSQL:** `5433`
- **Redis:** `6379`

## 🔑 Servicios Externos (Opcional - Para más adelante)

Cuando estés listo para configurar servicios externos, necesitarás:

### OpenAI (para funcionalidades de IA)
- **Variable:** `OPENAI_API_KEY`
- **Obtener en:** https://platform.openai.com/api-keys

### Supabase (si decides usarlo)
- **Variable:** `SUPABASE_URL`
- **Variable:** `SUPABASE_ANON_KEY`
- **Obtener en:** https://supabase.com

## ✅ Verificación

Para verificar que todo está funcionando:

```bash
# Verificar Docker
docker ps

# Verificar API
curl http://localhost:3004/api/v1/health

# Verificar Frontend
# Abre http://localhost:3000 (o el puerto que Next.js asigne)
```

## 📝 Notas Importantes

1. **No necesitas crear credenciales manualmente** - Todo está configurado automáticamente
2. **Las credenciales son solo para desarrollo** - En producción usa variables de entorno seguras
3. **Los archivos `.env` están en `.gitignore`** - No se subirán al repositorio
4. **Si cambias las credenciales en `docker-compose.yml`**, ejecuta `./scripts/setup-env.sh` nuevamente





