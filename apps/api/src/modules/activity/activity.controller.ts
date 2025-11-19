import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity log entry' })
  @ApiResponse({
    status: 201,
    description: 'Activity log created successfully',
  })
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get activity logs for a project' })
  @ApiResponse({
    status: 200,
    description: 'Returns activity logs for the project',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findByProject(
    @Param('projectId') projectId: string,
    @Query('limit') limit?: string
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    return this.activityService.findByProject(projectId, parsedLimit);
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Get activity logs for a specific entity' })
  @ApiResponse({
    status: 200,
    description: 'Returns activity logs for the entity',
  })
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string
  ) {
    return this.activityService.findByEntity(entityType, entityId);
  }
}
