import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Crear usuario de prueba
  const user = await prisma.user.upsert({
    where: { email: 'demo@vectorify.io' },
    update: {},
    create: {
      email: 'demo@vectorify.io',
      name: 'Demo User',
      provider: 'email',
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Crear workspace de prueba
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'demo-workspace' },
    update: {},
    create: {
      name: 'Demo Workspace',
      slug: 'demo-workspace',
      description: 'Workspace de demostración de Vectorify',
      members: {
        create: {
          userId: user.id,
          role: 'owner',
        },
      },
    },
  });

  console.log('✅ Created demo workspace:', workspace.name);

  // Crear proyecto de prueba con Stack YC
  const project = await prisma.project.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: 'demo-startup'
      }
    },
    update: {},
    create: {
      name: 'Demo Startup',
      slug: 'demo-startup',
      description: 'Proyecto de startup de demostración',
      stack: 'yc-startup',
      workspaceId: workspace.id,
      creatorId: user.id,
      config: {
        theme: 'dark',
        features: {
          aiCopilot: true,
          multiplayer: true,
        },
      },
    },
  });

  console.log('✅ Created demo project:', project.name);

  // Crear estructura de carpetas (Stack YC)
  const folders = [
    { name: 'Estrategia', path: '/estrategia', icon: '🎯' },
    { name: 'Producto', path: '/producto', icon: '🚀' },
    { name: 'Mercado', path: '/mercado', icon: '📊' },
    { name: 'Finanzas', path: '/finanzas', icon: '💰' },
    { name: 'Legal', path: '/legal', icon: '⚖️' },
  ];

  for (const folderData of folders) {
    await prisma.folder.upsert({
      where: {
        projectId_path: {
          projectId: project.id,
          path: folderData.path,
        },
      },
      update: {},
      create: {
        ...folderData,
        projectId: project.id,
      },
    });
  }

  console.log('✅ Created folder structure');

  // Crear algunos artefactos de ejemplo
  const estrategiaFolder = await prisma.folder.findFirst({
    where: { projectId: project.id, path: '/estrategia' },
  });

  if (estrategiaFolder) {
    await prisma.artifact.create({
      data: {
        name: 'Lean Canvas',
        type: 'lean-canvas',
        projectId: project.id,
        folderId: estrategiaFolder.id,
        content: {
          problem: ['Problema 1', 'Problema 2', 'Problema 3'],
          solution: ['Solución 1', 'Solución 2', 'Solución 3'],
          uniqueValueProposition: 'Tu propuesta de valor única',
          unfairAdvantage: '',
          customerSegments: '',
          keyMetrics: [],
          channels: [],
          costStructure: [],
          revenueStreams: [],
        },
      },
    });

    console.log('✅ Created Lean Canvas artifact');
  }

  // Crear una tarea de ejemplo
  await prisma.task.create({
    data: {
      title: 'Validar problema con 10 usuarios potenciales',
      description: 'Realizar entrevistas para validar que el problema existe',
      status: 'todo',
      priority: 'high',
      projectId: project.id,
      creatorId: user.id,
      sourceType: 'manual',
      labels: ['validación', 'discovery'],
    },
  });

  console.log('✅ Created demo task');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📧 Demo user: demo@vectorify.io');
  console.log('🏢 Demo workspace: demo-workspace');
  console.log('🚀 Demo project: demo-startup\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
