import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ description: 'Action performed', example: 'created' })
  @IsString()
  @IsNotEmpty()
  action: string; // "created", "updated", "deleted", "commented"

  @ApiProperty({ description: 'Entity type', example: 'artifact' })
  @IsString()
  @IsNotEmpty()
  entityType: string; // "project", "artifact", "task", "comment"

  @ApiProperty({ description: 'Entity ID' })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ description: 'Changes data', example: {} })
  @IsObject()
  changes: Record<string, any>;

  @ApiProperty({ description: 'Project ID' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
