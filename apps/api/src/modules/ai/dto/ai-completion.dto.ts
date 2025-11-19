import { IsString, IsArray, IsNumber, IsOptional, IsIn, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AIMessageDto {
  @ApiProperty({ example: 'user' })
  @IsString()
  @IsIn(['system', 'user', 'assistant'])
  role: 'system' | 'user' | 'assistant';

  @ApiProperty({ example: 'Hello, how can I help you?' })
  @IsString()
  content: string;
}

export class AICompletionDto {
  @ApiProperty({ example: 'openai' })
  @IsString()
  @IsIn(['openai', 'anthropic', 'google', 'openrouter'])
  provider: 'openai' | 'anthropic' | 'google' | 'openrouter';

  @ApiProperty({ example: 'gpt-4-turbo' })
  @IsString()
  model: string;

  @ApiProperty({ type: [AIMessageDto] })
  @IsArray()
  messages: AIMessageDto[];

  @ApiProperty({ example: 0.7, required: false })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @ApiProperty({ example: 1000, required: false })
  @IsNumber()
  @IsOptional()
  maxTokens?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  stream?: boolean;
}
