import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(private readonly db: DatabaseService) {}

  async create(createWorkspaceDto: CreateWorkspaceDto) {
    const { name, slug, description, ownerId } = createWorkspaceDto;

    return this.db.workspace.create({
      data: {
        name,
        slug,
        description,
        members: {
          create: {
            userId: ownerId,
            role: 'owner',
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.db.workspace.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const workspace = await this.db.workspace.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        projects: {
          take: 10,
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    return workspace;
  }

  async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    await this.findOne(id); // Check if exists

    return this.db.workspace.update({
      where: { id },
      data: updateWorkspaceDto,
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.db.workspace.delete({
      where: { id },
    });
  }
}
