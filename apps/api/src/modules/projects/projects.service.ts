import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly db: DatabaseService) {}

  async create(createProjectDto: CreateProjectDto) {
    let { name, slug, description, workspaceId, creatorId, stack, config } = createProjectDto;

    // Get or create demo workspace
    if (!workspaceId) {
      let demoWorkspace = await this.db.workspace.findUnique({
        where: { slug: 'demo-workspace' },
      });

      if (!demoWorkspace) {
        demoWorkspace = await this.db.workspace.create({
          data: {
            name: 'Demo Workspace',
            slug: 'demo-workspace',
            description: 'Default workspace for development',
          },
        });
      }
      workspaceId = demoWorkspace.id;
    }

    // Get or create demo user
    if (!creatorId) {
      let demoUser = await this.db.user.findUnique({
        where: { email: 'demo@vectorify.dev' },
      });

      if (!demoUser) {
        demoUser = await this.db.user.create({
          data: {
            email: 'demo@vectorify.dev',
            name: 'Demo User',
            provider: 'demo',
          },
        });

        // Add user to workspace
        await this.db.workspaceMember.create({
          data: {
            userId: demoUser.id,
            workspaceId,
            role: 'owner',
          },
        });
      }
      creatorId = demoUser.id;
    }

    // Create project with initial folder structure based on stack
    const project = await this.db.project.create({
      data: {
        name,
        slug,
        description,
        workspaceId,
        creatorId,
        stack,
        config: config || {},
      },
      include: {
        workspace: true,
        creator: true,
      },
    });

    // Initialize folder structure based on stack
    if (stack) {
      await this.initializeStackFolders(project.id, stack);
    }

    return project;
  }

  async findAll(workspaceId?: string) {
    const where = workspaceId ? { workspaceId } : {};

    return this.db.project.findMany({
      where,
      include: {
        workspace: true,
        creator: true,
        _count: {
          select: {
            artifacts: true,
            tasks: true,
            folders: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const project = await this.db.project.findUnique({
      where: { id },
      include: {
        workspace: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        },
        creator: true,
        folders: {
          include: {
            artifacts: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        artifacts: {
          where: {
            folderId: null, // Root artifacts
          },
          orderBy: {
            order: 'asc',
          },
        },
        tasks: {
          take: 20,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            assignee: true,
            creator: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id); // Check if exists

    return this.db.project.update({
      where: { id },
      data: updateProjectDto,
      include: {
        workspace: true,
        creator: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.db.project.delete({
      where: { id },
    });
  }

  async getProjectGraph(id: string) {
    const project = await this.findOne(id);

    // Build hierarchical folder tree with artifacts
    const folders = await this.db.folder.findMany({
      where: { projectId: id },
      include: {
        artifacts: {
          orderBy: { order: 'asc' },
        },
        children: {
          include: {
            artifacts: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return {
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
        stack: project.stack,
      },
      graph: this.buildFolderTree(folders),
    };
  }

  private buildFolderTree(folders: any[]) {
    const folderMap = new Map();
    const rootFolders: any[] = [];

    // Create map
    folders.forEach((folder) => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    // Build tree
    folders.forEach((folder) => {
      const node = folderMap.get(folder.id);
      if (folder.parentId) {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        rootFolders.push(node);
      }
    });

    return rootFolders;
  }

  private async initializeStackFolders(projectId: string, stack: string) {
    // Stack templates - This would ideally come from a config file or database
    const stackTemplates: Record<string, any[]> = {
      'yc-startup': [
        { name: 'Estrategia', path: '/estrategia', icon: '🎯', order: 0 },
        { name: 'Producto', path: '/producto', icon: '🚀', order: 1 },
        { name: 'Mercado', path: '/mercado', icon: '📊', order: 2 },
        { name: 'Finanzas', path: '/finanzas', icon: '💰', order: 3 },
        { name: 'Legal', path: '/legal', icon: '⚖️', order: 4 },
      ],
      'book-author': [
        { name: 'Personajes', path: '/personajes', icon: '👥', order: 0 },
        { name: 'Trama', path: '/trama', icon: '📖', order: 1 },
        { name: 'Capítulos', path: '/capitulos', icon: '📝', order: 2 },
        { name: 'Investigación', path: '/investigacion', icon: '🔍', order: 3 },
      ],
    };

    const template = stackTemplates[stack];
    if (template) {
      await this.db.folder.createMany({
        data: template.map((folder) => ({
          ...folder,
          projectId,
        })),
      });
    }
  }
}
