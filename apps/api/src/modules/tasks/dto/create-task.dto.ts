import { IsString, IsNotEmpty, IsOptional, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Validate problem with users' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Interview 10 potential users', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'todo', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'high', required: false })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiProperty({ example: 'project-id-123' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: 'user-id-123' })
  @IsString()
  @IsNotEmpty()
  creatorId: string;

  @ApiProperty({ example: 'user-id-456', required: false })
  @IsString()
  @IsOptional()
  assigneeId?: string;

  @ApiProperty({ example: 'artifact', required: false })
  @IsString()
  @IsOptional()
  sourceType?: string;

  @ApiProperty({ example: 'artifact-id-123', required: false })
  @IsString()
  @IsOptional()
  sourceId?: string;

  @ApiProperty({ example: ['validation', 'discovery'], required: false })
  @IsArray()
  @IsOptional()
  labels?: string[];

  @ApiProperty({ example: '2024-12-31T23:59:59Z', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
