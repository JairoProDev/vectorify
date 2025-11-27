# Vectorify - Project Development Environment (PDE)

> "El VS Code para construir startups y proyectos"

Vectorify es un **entorno de desarrollo de proyectos** que unifica estrategia, ejecución e inteligencia artificial en un solo espacio de trabajo. No es solo una herramienta de gestión de tareas, es un **IDE para negocios**.

## ✨ ¿Qué es Vectorify?

Así como los desarrolladores usan VS Code con github copilot o cursor AI o Antigravity de google o Windsurf para escribir software, figma o canva para editar diseños y capcut para editar videos los fundadores y creadores usarán Vectorify para construir negocios y proyectos.

### El Problema que Resolvemos

- **Fragmentación**: Tu estrategia está en Notion, tareas en ClickUp, diseños en Figma, ideas en ChatGPT.
- **Incoherencia**: Cambias el precio en un lugar pero se te olvida actualizarlo en otro.
- **Parálisis**: No sabes por dónde empezar o qué hacer después.

### La Solución: Un PDE (Project Development Environment)

- **Project Graph**: Tus datos conectados semánticamente, no archivos sueltos.
- **AI Copilot**: Vector entiende TODO tu proyecto y te guía proactivamente.
- **Strategy-as-Code**: Control de versiones para tu estrategia (branches, time travel).
- **Stacks**: Frameworks predefinidos (YC Startup, Book Author) para empezar en segundos.

## 🚀 Quick Start

### Opción 1: Setup Automatizado (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/tu-org/vectorify.git
cd vectorify

# Ejecutar script de setup
./scripts/setup.sh

# Iniciar desarrollo
pnpm dev
```

### Opción 2: Setup Manual

```bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar base de datos
docker-compose up -d

# 3. Configurar variables de entorno
./scripts/setup-env.sh

# 4. Configurar Prisma
pnpm --filter @vectorify/db db:generate
pnpm db:push

# 5. (Opcional) Seed de datos demo
pnpm --filter @vectorify/db db:seed

# 6. Iniciar desarrollo
pnpm dev
```

## 🔐 Credenciales y Configuración

**No necesitas crear credenciales manualmente.** El script `setup-env.sh` crea automáticamente todos los archivos `.env` necesarios con las credenciales de desarrollo.

### Credenciales de Desarrollo (Auto-configuradas)

- **PostgreSQL User:** `vectorify`
- **PostgreSQL Password:** `vectorify_dev_password`
- **PostgreSQL Database:** `vectorify_dev`
- **PostgreSQL Port:** `5433`
- **Redis Port:** `6379`

Ver `CREDENTIALS.md` para más detalles.

**Listo!** Abre:
- Frontend: http://localhost:3000
- API: http://localhost:3001/api/docs

## 📚 Documentación

- **[SETUP.md](./SETUP.md)** - Guía paso a paso de instalación
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura técnica completa
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Guía de desarrollo y convenciones

## 🏗️ Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| **Monorepo** | Turborepo + pnpm | Gestión eficiente del monorepo |
| **Backend** | NestJS + TypeScript | API modular y escalable |
| **Database** | PostgreSQL + Prisma | Type-safe ORM |
| **Frontend** | Next.js 14 + App Router | Framework React moderno |
| **UI** | Tailwind CSS + Shadcn/UI | Sistema de diseño |
| **State** | Zustand | State management ligero |
| **DevOps** | Docker Compose | Desarrollo local |

## 📦 Estructura del Proyecto

```
vectorify-monorepo/
├── apps/
│   ├── api/                    # Backend (NestJS)
│   │   ├── src/modules/        # Módulos de negocio
│   │   │   ├── workspaces/     # Gestión de workspaces
│   │   │   ├── projects/       # Gestión de proyectos
│   │   │   ├── artifacts/      # Archivos inteligentes
│   │   │   └── tasks/          # Sistema de PM
│   │   └── database/           # Servicio Prisma
│   │
│   └── web/                    # Frontend (Next.js)
│       ├── src/app/            # App Router
│       │   ├── workspace/      # IDE Layout
│       │   └── page.tsx        # Landing
│       ├── components/
│       │   ├── ui/             # Componentes Shadcn
│       │   └── workspace/      # Componentes del IDE
│       └── lib/api/            # Clientes de API
│
├── packages/
│   ├── db/                     # Prisma + Schema
│   │   ├── schema.prisma       # Modelo de datos
│   │   └── seed.ts             # Datos demo
│   ├── typescript-config/      # TS configs compartidas
│   └── eslint-config/          # ESLint configs
│
├── docker-compose.yml          # PostgreSQL + Redis
└── turbo.json                  # Turborepo config
```

## 🎯 Features Implementadas

- ✅ Monorepo con Turborepo
- ✅ Backend API completo (Workspaces, Projects, Artifacts, Tasks)
- ✅ Frontend con layout tipo IDE (Sidebar + Editor + Copilot Panel)
- ✅ Integración Frontend-Backend
- ✅ Sistema de "Stacks" (YC Startup, Book Author)
- ✅ Base de datos con Project Graph semántico
- ✅ Documentación completa

## 🚧 Roadmap

### Fase 2: Renderizadores de Artifacts
- [ ] Lean Canvas interactivo
- [ ] Roadmap/Gantt chart
- [ ] User Personas editor
- [ ] SWOT Matrix

### Fase 3: Multiplayer
- [ ] Yjs integration
- [ ] Cursores en tiempo real
- [ ] WebSocket server
- [ ] Conflict resolution

### Fase 4: AI Copilot
- [ ] LangGraph integration
- [ ] Vector database (pgvector)
- [ ] RAG pipeline
- [ ] Agentes proactivos

### Fase 5: Strategy-as-Code
- [ ] Git-like version control
- [ ] Branches (Experimentos)
- [ ] Time Travel
- [ ] Diff viewer

## 🛠️ Comandos Útiles

```bash
# Desarrollo
pnpm dev                              # Iniciar todo
pnpm --filter @vectorify/api dev      # Solo backend
pnpm --filter @vectorify/web dev      # Solo frontend

# Base de datos
pnpm db:studio                        # Prisma Studio (GUI)
pnpm db:push                          # Push schema a DB
pnpm db:migrate                       # Crear migración

# Build
pnpm build                            # Build todo
pnpm --filter @vectorify/api build    # Solo backend
pnpm --filter @vectorify/web build    # Solo frontend

# Linting
pnpm lint                             # Lint todo

# Limpieza
pnpm clean                            # Limpiar artifacts
docker-compose down -v                # Limpiar DB
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y de uso interno.

## 💡 Filosofía

> "No somos solo una herramienta de planeación como notion o como ClickUp para ejecución. Somos una herramienta de co-creación, planeación, estrategia y ejecución. La ejecución es solo el output de una buena estrategia."

Vectorify no compite en el Océano Rojo de la gestión de tareas. Creamos el Océano Azul de la **Ingeniería de Negocios**.

---

**Vectorify** - Construido con 💙 para fundadores y creadores

[Website](https://vectorify.io) • [Documentación](./SETUP.md) • [Arquitectura](./ARCHITECTURE.md)
