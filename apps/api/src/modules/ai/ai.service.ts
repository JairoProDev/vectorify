import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { AICompletionDto } from './dto/ai-completion.dto';

interface MessageEvent {
  data: string;
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(private configService: ConfigService) {}

  async complete(completionDto: AICompletionDto, userApiKey?: string) {
    const { provider, model, messages, temperature = 0.7, maxTokens = 1000 } = completionDto;

    // Get API key (user's key takes precedence over system key)
    const apiKey = this.getApiKey(provider, userApiKey);

    try {
      switch (provider) {
        case 'openai':
          return await this.completeOpenAI(model, messages, temperature, maxTokens, apiKey);

        case 'anthropic':
          return await this.completeAnthropic(model, messages, temperature, maxTokens, apiKey);

        case 'google':
          return await this.completeGoogle(model, messages, temperature, maxTokens, apiKey);

        case 'openrouter':
          return await this.completeOpenRouter(model, messages, temperature, maxTokens, apiKey);

        default:
          throw new BadRequestException(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      this.logger.error(`AI completion failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  streamComplete(completionDto: AICompletionDto, userApiKey?: string): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      this.complete(completionDto, userApiKey)
        .then((response) => {
          // Split response into chunks for streaming effect
          const words = response.content.split(' ');
          words.forEach((word, index) => {
            setTimeout(() => {
              subscriber.next({
                data: JSON.stringify({ content: word + ' ' }),
              } as MessageEvent);

              if (index === words.length - 1) {
                subscriber.next({ data: '[DONE]' } as MessageEvent);
                subscriber.complete();
              }
            }, index * 50); // 50ms delay between words
          });
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }

  async analyzeArtifact(artifactType: string, content: any, userApiKey?: string) {
    const prompt = this.buildAnalysisPrompt(artifactType, content);

    const response = await this.complete(
      {
        provider: 'openai',
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are Vector, an AI assistant specialized in business strategy and product development.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        maxTokens: 1000,
      },
      userApiKey
    );

    return { analysis: response.content };
  }

  async suggestImprovements(projectContext: any, userApiKey?: string) {
    const response = await this.complete(
      {
        provider: 'openai',
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are Vector, a strategic AI advisor. Analyze the project and suggest 3-5 actionable improvements.',
          },
          {
            role: 'user',
            content: `Project Context:\n${JSON.stringify(projectContext, null, 2)}\n\nProvide 3-5 specific, actionable suggestions.`,
          },
        ],
        temperature: 0.8,
      },
      userApiKey
    );

    const suggestions = response.content
      .split('\n')
      .filter((line) => line.trim().match(/^\d+\./))
      .map((line) => line.replace(/^\d+\.\s*/, '').trim());

    return { suggestions };
  }

  async detectInconsistencies(projectData: any, userApiKey?: string) {
    const response = await this.complete(
      {
        provider: 'openai',
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are Vector, an AI that detects logical inconsistencies in business strategies.',
          },
          {
            role: 'user',
            content: `Analyze for inconsistencies:\n${JSON.stringify(projectData, null, 2)}\n\nReturn JSON array: [{ "type": string, "message": string, "severity": "low"|"medium"|"high" }]`,
          },
        ],
        temperature: 0.3,
      },
      userApiKey
    );

    try {
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const inconsistencies = JSON.parse(jsonMatch[0]);
        return { inconsistencies };
      }
    } catch (e) {
      this.logger.error('Failed to parse inconsistencies', e);
    }

    return { inconsistencies: [] };
  }

  private getApiKey(provider: string, userApiKey?: string): string {
    if (userApiKey) return userApiKey;

    const envKey = `${provider.toUpperCase()}_API_KEY`;
    const key = this.configService.get<string>(envKey);

    if (!key) {
      throw new BadRequestException(
        `No API key provided for ${provider}. Please provide a key in the Authorization header or configure ${envKey} environment variable.`
      );
    }

    return key;
  }

  private async completeOpenAI(
    model: string,
    messages: any[],
    temperature: number,
    maxTokens: number,
    apiKey: string
  ) {
    // Note: In production, you'd use the actual OpenAI SDK
    // For now, this is a placeholder that you'll implement
    this.logger.log(`OpenAI completion with model: ${model}`);

    return {
      content: 'This is a placeholder response. Configure OpenAI API key to use real completions.',
      model,
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
    };
  }

  private async completeAnthropic(
    model: string,
    messages: any[],
    temperature: number,
    maxTokens: number,
    apiKey: string
  ) {
    this.logger.log(`Anthropic completion with model: ${model}`);

    return {
      content:
        'This is a placeholder response. Configure Anthropic API key to use real completions.',
      model,
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
    };
  }

  private async completeGoogle(
    model: string,
    messages: any[],
    temperature: number,
    maxTokens: number,
    apiKey: string
  ) {
    this.logger.log(`Google completion with model: ${model}`);

    return {
      content: 'This is a placeholder response. Configure Google API key to use real completions.',
      model,
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
    };
  }

  private async completeOpenRouter(
    model: string,
    messages: any[],
    temperature: number,
    maxTokens: number,
    apiKey: string
  ) {
    this.logger.log(`OpenRouter completion with model: ${model}`);

    return {
      content:
        'This is a placeholder response. Configure OpenRouter API key to use real completions.',
      model,
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
    };
  }

  private buildAnalysisPrompt(artifactType: string, content: any): string {
    switch (artifactType) {
      case 'lean-canvas':
        return `Analyze this Lean Canvas:\n${JSON.stringify(content, null, 2)}\n\nProvide feedback on value proposition, problem-solution fit, and revenue model.`;

      case 'swot':
        return `Analyze this SWOT:\n${JSON.stringify(content, null, 2)}\n\nProvide insights on missing factors and strategies.`;

      case 'roadmap':
        return `Analyze this roadmap:\n${JSON.stringify(content, null, 2)}\n\nProvide feedback on prioritization and timeline.`;

      default:
        return `Analyze:\n${JSON.stringify(content, null, 2)}\n\nProvide constructive feedback.`;
    }
  }
}
