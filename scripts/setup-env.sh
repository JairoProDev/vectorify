#!/bin/bash

# Script para configurar variables de entorno
# Este script crea los archivos .env necesarios para el proyecto

set -e

echo "🔧 Configurando variables de entorno..."

# Credenciales de PostgreSQL (desde docker-compose.yml)
POSTGRES_USER="vectorify"
POSTGRES_PASSWORD="vectorify_dev_password"
POSTGRES_DB="vectorify_dev"
POSTGRES_PORT="5433"
POSTGRES_HOST="localhost"

# Construir DATABASE_URL
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

# Crear .env en la raíz del proyecto
cat > .env << EOF
# Database Configuration
DATABASE_URL=${DATABASE_URL}

# API Configuration
PORT=3004
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Environment
NODE_ENV=development
EOF

echo "✅ Archivo .env creado en la raíz del proyecto"

# Crear .env en apps/api
mkdir -p apps/api
cat > apps/api/.env << EOF
# Database Configuration
DATABASE_URL=${DATABASE_URL}

# API Configuration
PORT=3004
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Environment
NODE_ENV=development
EOF

echo "✅ Archivo .env creado en apps/api"

# Crear .env.local en apps/web (para Next.js)
mkdir -p apps/web
cat > apps/web/.env.local << EOF
# Frontend API URL
NEXT_PUBLIC_API_URL=http://localhost:3004/api/v1
EOF

echo "✅ Archivo .env.local creado en apps/web"

echo ""
echo "🎉 Variables de entorno configuradas correctamente!"
echo ""
echo "📋 Resumen de credenciales:"
echo "   PostgreSQL User: ${POSTGRES_USER}"
echo "   PostgreSQL Password: ${POSTGRES_PASSWORD}"
echo "   PostgreSQL Database: ${POSTGRES_DB}"
echo "   PostgreSQL Port: ${POSTGRES_PORT}"
echo "   Database URL: ${DATABASE_URL}"
echo ""
echo "🚀 Ahora puedes ejecutar: pnpm dev"





