import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtifactDto {
  @ApiProperty({ example: 'Lean Canvas' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'lean-canvas' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: { problem: [], solution: [], uniqueValueProposition: '' },
    required: false
  })
  @IsObject()
  @IsOptional()
  content?: Record<string, any>;

  @ApiProperty({ example: 'project-id-123' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: 'folder-id-123', required: false })
  @IsString()
  @IsOptional()
  folderId?: string;

  @ApiProperty({ example: '📊', required: false })
  @IsString()
  @IsOptional()
  icon?: string;
}
