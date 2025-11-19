# Vectorify - Development Guide

## Estructura del Proyecto

```
vectorify-monorepo/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── modules/       # Módulos de negocio
│   │   │   │   ├── workspaces/
│   │   │   │   ├── projects/
│   │   │   │   ├── artifacts/
│   │   │   │   └── tasks/
│   │   │   ├── database/      # Servicio de Prisma
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── package.json
│   │
│   └── web/                    # Frontend Next.js
│       ├── src/
│       │   ├── app/           # App Router
│       │   │   ├── workspace/ # IDE Layout
│       │   │   └── page.tsx   # Landing page
│       │   ├── components/
│       │   │   ├── ui/        # Shadcn/UI components
│       │   │   └── workspace/ # Workspace components
│       │   └── lib/
│       │       ├── api/       # API clients
│       │       └── utils.ts
│       └── package.json
│
├── packages/
│   ├── db/                     # Prisma + Schema
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── index.ts
│   ├── typescript-config/      # Shared TS configs
│   └── eslint-config/          # Shared ESLint configs
│
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Convenciones de Código

### TypeScript

- **Strict Mode**: Siempre activado
- **No usar `any`**: Usa tipos específicos o `unknown`
- **Naming**:
  - `PascalCase`: Clases, interfaces, tipos
  - `camelCase`: Variables, funciones
  - `UPPER_CASE`: Constantes

### Backend (NestJS)

```typescript
// Estructura de un módulo
@Module({
  imports: [],
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [ExampleService],
})
export class ExampleModule {}

// Controller
@Controller('example')
export class ExampleController {
  constructor(private readonly service: ExampleService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}

// Service
@Injectable()
export class ExampleService {
  constructor(private readonly db: DatabaseService) {}

  async findAll() {
    return this.db.example.findMany();
  }
}
```

### Frontend (Next.js)

```typescript
// Server Component (por defecto)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component
'use client';

export default function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState()}>Click</button>;
}
```

### Prisma Schema

```prisma
model Example {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([name])
  @@map("examples")
}
```

## Workflow de Desarrollo

### 1. Crear una Nueva Feature

```bash
# Crear rama
git checkout -b feature/nombre-feature

# Hacer cambios...

# Commit
git add .
git commit -m "feat: descripción de la feature"

# Push
git push origin feature/nombre-feature
```

### 2. Añadir un Nuevo Módulo Backend

```bash
# Dentro de apps/api
cd apps/api

# Crear estructura
mkdir -p src/modules/example
cd src/modules/example

# Crear archivos
touch example.module.ts
touch example.controller.ts
touch example.service.ts
mkdir dto
touch dto/create-example.dto.ts
touch dto/update-example.dto.ts
```

### 3. Añadir una Nueva Tabla en Prisma

```bash
# Editar schema.prisma
code packages/db/schema.prisma

# Después de añadir el modelo, generar cliente
pnpm --filter @vectorify/db db:generate

# Push a la DB (desarrollo)
pnpm db:push

# O crear migración (producción)
pnpm db:migrate
```

### 4. Añadir un Nuevo Componente UI

```bash
# Crear componente
touch apps/web/src/components/ui/new-component.tsx

# Usar en página
# apps/web/src/app/ejemplo/page.tsx
import { NewComponent } from '@/components/ui/new-component';
```

## Testing

### Backend

```bash
# Unit tests
pnpm --filter @vectorify/api test

# E2E tests
pnpm --filter @vectorify/api test:e2e

# Coverage
pnpm --filter @vectorify/api test:cov
```

### Frontend

```bash
# Tests (cuando se configuren)
pnpm --filter @vectorify/web test
```

## Debugging

### Backend (NestJS)

```bash
# Modo debug
pnpm --filter @vectorify/api start:debug

# En VS Code, agregar a .vscode/launch.json:
{
  "type": "node",
  "request": "attach",
  "name": "Attach NestJS",
  "port": 9229,
  "restart": true
}
```

### Frontend (Next.js)

```bash
# Next.js incluye debugging automático
# Abre Chrome DevTools y ve a Sources
```

### Database

```bash
# Prisma Studio (GUI)
pnpm db:studio

# Ver logs de PostgreSQL
docker-compose logs -f postgres
```

## Performance

### Monorepo

```bash
# Ver qué se ejecuta
turbo run build --dry-run

# Limpiar cache
rm -rf .turbo

# Ver análisis de build
turbo run build --graph
```

### Next.js

```bash
# Analizar bundle
pnpm --filter @vectorify/web analyze
```

## Próximas Tareas de Desarrollo

### Fase 1: MVP Funcional (ACTUAL)

- [x] Monorepo setup
- [x] Backend API (CRUD)
- [x] Frontend IDE layout
- [x] Integración Frontend-Backend
- [ ] Renderizadores de Artifacts (Lean Canvas, Roadmap)
- [ ] Sistema de autenticación

### Fase 2: Multiplayer

- [ ] Configurar Yjs
- [ ] WebSocket server
- [ ] Cursores en tiempo real
- [ ] Conflict resolution

### Fase 3: AI Copilot

- [ ] Integración con LangChain/LangGraph
- [ ] Vector database (pgvector)
- [ ] RAG pipeline
- [ ] Agentes proactivos

### Fase 4: Stacks Avanzados

- [ ] Sistema de plantillas dinámicas
- [ ] Marketplace de Stacks
- [ ] Custom Stack Builder

## Recursos

- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Shadcn/UI](https://ui.shadcn.com/)

## Troubleshooting

### "Module not found" en imports

```bash
# Regenerar cliente de Prisma
pnpm --filter @vectorify/db db:generate

# Reinstalar dependencias
pnpm install
```

### Cambios en el schema no se reflejan

```bash
# Push forzado
pnpm db:push --force-reset
```

### Hot reload no funciona

```bash
# Reiniciar dev servers
# Ctrl+C y luego
pnpm dev
```

---

Mantén este documento actualizado con nuevas convenciones y prácticas del equipo.
