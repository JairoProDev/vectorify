# Vectorify - Arquitectura Técnica

## Visión General

Vectorify es un **PDE (Project Development Environment)** - un entorno de desarrollo de proyectos que unifica estrategia, ejecución e inteligencia artificial.

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                  │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐  │
│  │  Sidebar   │  │   Editor   │  │  Copilot Panel  │  │
│  │ (Navigator)│  │  (Canvas)  │  │   (AI Agent)    │  │
│  └────────────┘  └────────────┘  └─────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (NestJS)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Workspaces  │  │   Projects   │  │  Artifacts   │ │
│  │   Module     │  │    Module    │  │   Module     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Tasks     │  │   Database   │  │     AI       │ │
│  │   Module     │  │   Service    │  │   Engine     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌──────────────────────┐
         │   PostgreSQL + Redis │
         │    (Prisma ORM)      │
         └──────────────────────┘
```

## Stack Tecnológico

### Monorepo
- **Turborepo**: Gestión de monorepo con caching inteligente
- **pnpm**: Gestor de paquetes eficiente

### Backend
- **NestJS**: Framework Node.js con arquitectura modular
- **Prisma**: ORM type-safe para PostgreSQL
- **TypeScript**: Type-safety end-to-end
- **Swagger**: Documentación automática de API

### Frontend
- **Next.js 14**: Framework React con App Router
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Componentes accesibles y customizables
- **Zustand**: State management ligero
- **Lucide React**: Sistema de iconos

### Base de Datos
- **PostgreSQL**: Base de datos relacional
- **Redis**: Cache y queues (preparado para futuro)

## Modelo de Datos (Project Graph)

El corazón de Vectorify es el **Project Graph** - un grafo de conocimiento semántico.

```
Workspace
  ↓
Projects
  ↓
├── Folders (Hierarchy)
│     ↓
│   Artifacts (Interactive Components)
│
├── Tasks (PM System)
│
├── Snapshots (Version Control)
│
└── Activity Logs (Audit Trail)
```

### Entidades Principales

1. **User**: Usuarios del sistema
2. **Workspace**: Espacio de trabajo (equipo/organización)
3. **Project**: El proyecto (startup, libro, etc.)
4. **Folder**: Carpetas organizacionales (/Estrategia, /Producto)
5. **Artifact**: Archivos inteligentes (Lean Canvas, Roadmap, etc.)
6. **Task**: Tareas de gestión de proyecto
7. **Comment**: Colaboración en artifacts y tasks
8. **ActivityLog**: Historial de cambios (Time Travel)

## Flujo de Datos

### Creación de Proyecto

```
1. Usuario → Frontend: Selecciona Stack (YC Startup)
2. Frontend → API: POST /api/v1/projects
3. API → Database: Crea Project + Folders del Stack
4. Database → API: Retorna Project completo
5. API → Frontend: Proyecto creado
6. Frontend → Usuario: Redirect a /workspace/projects/:id
```

### Renderizado del IDE

```
1. Frontend carga Layout (Sidebar + Editor + Copilot)
2. Sidebar → API: GET /api/v1/projects/:id/graph
3. API → Database: Query del árbol de folders/artifacts
4. Editor: Espera selección de artifact
5. Copilot: Muestra sugerencias contextuales
```

## Stacks (Project Templates)

Los **Stacks** son configuraciones predefinidas que instalan:

1. **Estructura de Folders**: Carpetas organizacionales
2. **Artifacts Iniciales**: Templates pre-cargados
3. **Configuración**: Settings específicos del stack

### Ejemplo: YC Startup Stack

```javascript
{
  folders: [
    '/estrategia',  // Lean Canvas, Vision, Mission
    '/producto',    // Roadmap, User Stories
    '/mercado',     // Competencia, Personas
    '/finanzas',    // Proyecciones, Pricing
    '/legal'        // Contratos, IP
  ]
}
```

## Módulos Backend (NestJS)

### 1. Workspaces Module
- Gestión de espacios de trabajo
- Membresía y roles

### 2. Projects Module
- CRUD de proyectos
- Inicialización de Stacks
- Project Graph API

### 3. Artifacts Module
- CRUD de artefactos
- Content storage (JSONB)

### 4. Tasks Module
- Sistema de PM nativo
- Relación con artifacts

### 5. Database Module (Global)
- Singleton de Prisma Client
- Lifecycle hooks

## Frontend - Layout IDE

### Sidebar (Izquierda)
- **File Navigator**: Árbol de carpetas y artifacts
- **Search**: Búsqueda de archivos
- **Quick Actions**: Crear artifact, etc.

### Editor (Centro)
- **Canvas Multimodal**: Espacio de trabajo principal
- **Renderizadores Específicos**: Cada tipo de artifact tiene su propio componente
  - `lean-canvas` → `<LeanCanvasEditor />`
  - `roadmap` → `<RoadmapEditor />`

### Copilot Panel (Derecha)
- **AI Insights**: Alertas proactivas
- **Suggestions**: Acciones recomendadas
- **Chat**: Interfaz conversacional con Vector

## Próximas Funcionalidades

### Fase 2: Multiplayer (Yjs)
- Colaboración en tiempo real
- Cursores de usuarios
- Edición simultánea

### Fase 3: AI Engine (LangGraph)
- Agentes autónomos
- RAG con vectores (pgvector)
- Análisis de coherencia

### Fase 4: Integrations (MCP)
- GitHub
- Figma
- Google Drive
- ClickUp

### Fase 5: Strategy-as-Code
- Git-like version control
- Branches (Experimentos)
- Time Travel

## Escalabilidad

### Actual (MVP)
- Monolith modular (NestJS)
- PostgreSQL single instance
- Deployed en Vercel (Frontend) + Railway (Backend)

### Futuro
- Microservicios (si es necesario)
- PostgreSQL con replicas
- Redis para cache y queues
- WebSocket server para real-time

## Seguridad

- **Autenticación**: Auth.js / Clerk (futuro)
- **Autorización**: RBAC a nivel de workspace
- **Validación**: class-validator en DTOs
- **SQL Injection**: Prisma previene automáticamente

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

---

Para entender el flujo completo, revisa:
- `apps/api/src/modules/projects/` - Lógica de proyectos
- `apps/web/src/app/workspace/` - UI del IDE
- `packages/db/schema.prisma` - Modelo de datos
