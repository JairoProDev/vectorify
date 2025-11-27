import { PrismaClient } from '@prisma/client';

// Singleton pattern para Prisma Client
// Evita múltiples instancias en desarrollo (hot reload)

const globalForPrisma = globalThis as any;

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
export * from '@prisma/client';
