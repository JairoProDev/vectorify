#!/bin/bash

# Vectorify - Setup Script
# Este script automatiza la configuración inicial del proyecto

set -e

echo "🚀 Vectorify Setup Script"
echo "=========================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js >= 18"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versión debe ser >= 18. Tu versión: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 pnpm no está instalado. Instalando..."
    npm install -g pnpm
fi

echo "✅ pnpm $(pnpm -v) detectado"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker"
    exit 1
fi

echo "✅ Docker detectado"

# Install dependencies
echo ""
echo "📦 Instalando dependencias..."
pnpm install

# Start Docker containers
echo ""
echo "🐳 Iniciando base de datos (Docker)..."
docker-compose up -d

# Wait for PostgreSQL
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5

# Generate Prisma Client
echo ""
echo "🔧 Generando cliente de Prisma..."
pnpm --filter @vectorify/db db:generate

# Push database schema
echo ""
echo "📊 Creando tablas en la base de datos..."
pnpm db:push

# Seed database
echo ""
read -p "¿Deseas poblar la base de datos con datos demo? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Poblando base de datos..."
    pnpm --filter @vectorify/db db:seed
fi

echo ""
echo "✨ ¡Setup completado!"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Ejecuta 'pnpm dev' para iniciar el servidor"
echo "   2. Abre http://localhost:3000 en tu navegador"
echo "   3. Ve a http://localhost:3000/workspace para el IDE"
echo "   4. API docs: http://localhost:3001/api/docs"
echo ""
echo "🎉 ¡Happy coding!"
