import { IsString, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Artifact ID (if commenting on artifact)' })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.taskId)
  artifactId?: string;

  @ApiPropertyOptional({ description: 'Task ID (if commenting on task)' })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.artifactId)
  taskId?: string;

  @ApiProperty({ description: 'Author ID' })
  @IsString()
  @IsNotEmpty()
  authorId: string;
}
