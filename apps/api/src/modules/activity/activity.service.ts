import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async create(createActivityDto: CreateActivityDto) {
    const activity = await this.prisma.activityLog.create({
      data: createActivityDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return activity;
  }

  async findByProject(projectId: string, limit: number = 50) {
    const activities = await this.prisma.activityLog.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return activities;
  }

  async findByEntity(entityType: string, entityId: string) {
    const activities = await this.prisma.activityLog.findMany({
      where: {
        entityType,
        entityId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return activities;
  }

  // Helper method to log artifact changes
  async logArtifactChange(
    action: 'created' | 'updated' | 'deleted',
    artifactId: string,
    projectId: string,
    userId: string,
    changes: Record<string, any> = {}
  ) {
    return this.create({
      action,
      entityType: 'artifact',
      entityId: artifactId,
      changes,
      projectId,
      userId,
    });
  }

  // Helper method to log task changes
  async logTaskChange(
    action: 'created' | 'updated' | 'deleted' | 'completed',
    taskId: string,
    projectId: string,
    userId: string,
    changes: Record<string, any> = {}
  ) {
    return this.create({
      action,
      entityType: 'task',
      entityId: taskId,
      changes,
      projectId,
      userId,
    });
  }

  // Helper method to log comment changes
  async logComment(
    commentId: string,
    entityType: 'artifact' | 'task',
    entityId: string,
    projectId: string,
    userId: string
  ) {
    return this.create({
      action: 'commented',
      entityType,
      entityId,
      changes: { commentId },
      projectId,
      userId,
    });
  }
}
