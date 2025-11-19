import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({ example: 'My Workspace' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'my-workspace' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'My awesome workspace', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'user-id-123' })
  @IsString()
  @IsNotEmpty()
  ownerId: string;
}
