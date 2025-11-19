import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Startup' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'my-startup' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'An innovative startup idea', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'workspace-id-123' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ example: 'user-id-123' })
  @IsString()
  @IsNotEmpty()
  creatorId: string;

  @ApiProperty({ example: 'yc-startup', required: false })
  @IsString()
  @IsOptional()
  stack?: string;

  @ApiProperty({ example: { theme: 'dark' }, required: false })
  @IsObject()
  @IsOptional()
  config?: Record<string, any>;
}
