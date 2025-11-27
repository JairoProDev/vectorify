import { PrismaClient } from './generated/client/index.js';

// Singleton pattern para Prisma Client
// Evita múltiples instancias en desarrollo (hot reload)

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Re-exportar tipos generados
export * from './generated/client/index.js';
