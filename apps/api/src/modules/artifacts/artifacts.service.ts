import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateArtifactDto } from './dto/create-artifact.dto';
import { UpdateArtifactDto } from './dto/update-artifact.dto';

@Injectable()
export class ArtifactsService {
  constructor(private readonly db: DatabaseService) {}

  async create(createArtifactDto: CreateArtifactDto) {
    const { name, type, content, projectId, folderId, icon } = createArtifactDto;

    return this.db.artifact.create({
      data: {
        name,
        type,
        content: content || {},
        projectId,
        folderId,
        icon,
      },
      include: {
        folder: true,
        project: true,
      },
    });
  }

  async findAll(projectId?: string, type?: string) {
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (type) where.type = type;

    return this.db.artifact.findMany({
      where,
      include: {
        folder: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const artifact = await this.db.artifact.findUnique({
      where: { id },
      include: {
        project: true,
        folder: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        tasks: {
          include: {
            assignee: true,
          },
        },
      },
    });

    if (!artifact) {
      throw new NotFoundException(`Artifact with ID ${id} not found`);
    }

    return artifact;
  }

  async update(id: string, updateArtifactDto: UpdateArtifactDto) {
    await this.findOne(id); // Check if exists

    return this.db.artifact.update({
      where: { id },
      data: updateArtifactDto,
      include: {
        folder: true,
        project: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.db.artifact.delete({
      where: { id },
    });
  }
}
