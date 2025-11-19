import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiQuery({ name: 'workspaceId', required: false })
  findAll(@Query('workspaceId') workspaceId?: string) {
    return this.projectsService.findAll(workspaceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID with full details' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Get(':id/graph')
  @ApiOperation({ summary: 'Get complete project graph (folders + artifacts)' })
  getProjectGraph(@Param('id') id: string) {
    return this.projectsService.getProjectGraph(id);
  }
}
