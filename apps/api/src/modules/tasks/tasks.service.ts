import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly db: DatabaseService) {}

  async create(createTaskDto: CreateTaskDto) {
    const {
      title,
      description,
      status,
      priority,
      projectId,
      creatorId,
      assigneeId,
      sourceType,
      sourceId,
      labels,
      dueDate,
    } = createTaskDto;

    return this.db.task.create({
      data: {
        title,
        description,
        status: status || 'todo',
        priority: priority || 'medium',
        projectId,
        creatorId,
        assigneeId,
        sourceType,
        sourceId,
        labels: labels || [],
        dueDate,
      },
      include: {
        project: true,
        creator: true,
        assignee: true,
      },
    });
  }

  async findAll(projectId?: string, status?: string, assigneeId?: string) {
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;

    return this.db.task.findMany({
      where,
      include: {
        project: true,
        creator: true,
        assignee: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: string) {
    const task = await this.db.task.findUnique({
      where: { id },
      include: {
        project: true,
        creator: true,
        assignee: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        artifacts: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id); // Check if exists

    const updateData: any = { ...updateTaskDto };

    // If status is being set to "done", set completedAt
    if (updateTaskDto.status === 'done') {
      updateData.completedAt = new Date();
    }

    return this.db.task.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        creator: true,
        assignee: true,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.update(id, { status });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.db.task.delete({
      where: { id },
    });
  }
}
