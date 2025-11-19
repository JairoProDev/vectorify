import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@ApiTags('workspaces')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesService.create(createWorkspaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workspaces' })
  findAll() {
    return this.workspacesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workspace by ID' })
  findOne(@Param('id') id: string) {
    return this.workspacesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update workspace' })
  update(@Param('id') id: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspacesService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workspace' })
  remove(@Param('id') id: string) {
    return this.workspacesService.remove(id);
  }
}
