import { Controller, Post, Body, Headers, Sse } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AIService } from './ai.service';
import { AICompletionDto } from './dto/ai-completion.dto';

@ApiTags('ai')
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('complete')
  @ApiOperation({ summary: 'Get AI completion' })
  @ApiBearerAuth()
  async complete(
    @Body() completionDto: AICompletionDto,
    @Headers('authorization') auth?: string
  ) {
    const apiKey = auth?.replace('Bearer ', '');
    return this.aiService.complete(completionDto, apiKey);
  }

  @Sse('complete/stream')
  @ApiOperation({ summary: 'Stream AI completion' })
  streamComplete(
    @Body() completionDto: AICompletionDto,
    @Headers('authorization') auth?: string
  ): Observable<any> {
    const apiKey = auth?.replace('Bearer ', '');
    return this.aiService.streamComplete(completionDto, apiKey);
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze artifact with AI' })
  async analyzeArtifact(
    @Body() body: { artifactType: string; content: any },
    @Headers('authorization') auth?: string
  ) {
    const apiKey = auth?.replace('Bearer ', '');
    return this.aiService.analyzeArtifact(body.artifactType, body.content, apiKey);
  }

  @Post('suggest')
  @ApiOperation({ summary: 'Get AI suggestions' })
  async suggestImprovements(
    @Body() body: { projectContext: any },
    @Headers('authorization') auth?: string
  ) {
    const apiKey = auth?.replace('Bearer ', '');
    return this.aiService.suggestImprovements(body.projectContext, apiKey);
  }

  @Post('detect-inconsistencies')
  @ApiOperation({ summary: 'Detect project inconsistencies' })
  async detectInconsistencies(
    @Body() body: { projectData: any },
    @Headers('authorization') auth?: string
  ) {
    const apiKey = auth?.replace('Bearer ', '');
    return this.aiService.detectInconsistencies(body.projectData, apiKey);
  }
}
