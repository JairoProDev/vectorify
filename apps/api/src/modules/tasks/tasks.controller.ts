import { Controller, Get, Post, Body, Param, Put, Delete, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'assigneeId', required: false })
  findAll(
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
    @Query('assigneeId') assigneeId?: string
  ) {
    return this.tasksService.findAll(projectId, status, assigneeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.tasksService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
