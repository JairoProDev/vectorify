import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ArtifactsService } from './artifacts.service';
import { CreateArtifactDto } from './dto/create-artifact.dto';
import { UpdateArtifactDto } from './dto/update-artifact.dto';

@ApiTags('artifacts')
@Controller('artifacts')
export class ArtifactsController {
  constructor(private readonly artifactsService: ArtifactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new artifact' })
  create(@Body() createArtifactDto: CreateArtifactDto) {
    return this.artifactsService.create(createArtifactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all artifacts' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'type', required: false })
  findAll(@Query('projectId') projectId?: string, @Query('type') type?: string) {
    return this.artifactsService.findAll(projectId, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artifact by ID' })
  findOne(@Param('id') id: string) {
    return this.artifactsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update artifact' })
  update(@Param('id') id: string, @Body() updateArtifactDto: UpdateArtifactDto) {
    return this.artifactsService.update(id, updateArtifactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete artifact' })
  remove(@Param('id') id: string) {
    return this.artifactsService.remove(id);
  }
}
