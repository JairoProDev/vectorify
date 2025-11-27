/**
 * AI Service - Multi-LLM Support
 *
 * Supports multiple LLM providers:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Anthropic (Claude)
 * - Google (Gemini)
 * - Open Source (via OpenRouter)
 */

export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'openrouter';

export type LLMModel =
  | 'gpt-4-turbo'
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'gemini-pro'
  | 'mixtral-8x7b'
  | 'llama-2-70b';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionRequest {
  provider: LLMProvider;
  model: LLMModel;
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AICompletionResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class AIService {
  private apiKey: string | null = null;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004/api/v1';
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const response = await fetch(`${this.baseURL}/ai/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'AI completion failed');
    }

    return response.json();
  }

  async streamComplete(
    request: AICompletionRequest,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const response = await fetch(`${this.baseURL}/ai/complete/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
      },
      body: JSON.stringify({ ...request, stream: true }),
    });

    if (!response.ok) {
      throw new Error('AI streaming failed');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onChunk(parsed.content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }

  // Helper methods for specific use cases

  async analyzeArtifact(artifactType: string, content: any): Promise<string> {
    const prompt = this.buildAnalysisPrompt(artifactType, content);

    const response = await this.complete({
      provider: 'openai',
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are Vector, an AI assistant specialized in business strategy and product development. You help users build better projects by providing insightful analysis and suggestions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    return response.content;
  }

  async suggestImprovements(projectContext: any): Promise<string[]> {
    const response = await this.complete({
      provider: 'openai',
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are Vector, a strategic AI advisor. Analyze the project and suggest 3-5 actionable improvements.',
        },
        {
          role: 'user',
          content: `Project Context:\n${JSON.stringify(projectContext, null, 2)}\n\nProvide 3-5 specific, actionable suggestions to improve this project.`,
        },
      ],
      temperature: 0.8,
    });

    // Parse suggestions from response
    const suggestions = response.content
      .split('\n')
      .filter((line) => line.trim().match(/^\d+\./))
      .map((line) => line.replace(/^\d+\.\s*/, '').trim());

    return suggestions;
  }

  async detectInconsistencies(projectData: any): Promise<Array<{
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>> {
    const response = await this.complete({
      provider: 'openai',
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are Vector, an AI that detects logical inconsistencies in business strategies. Analyze the project data and identify any contradictions or misalignments.',
        },
        {
          role: 'user',
          content: `Analyze this project for inconsistencies:\n${JSON.stringify(projectData, null, 2)}\n\nReturn a JSON array of inconsistencies with format: [{ "type": string, "message": string, "severity": "low" | "medium" | "high" }]`,
        },
      ],
      temperature: 0.3,
    });

    try {
      // Try to parse JSON from response
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse inconsistencies:', e);
    }

    return [];
  }

  private buildAnalysisPrompt(artifactType: string, content: any): string {
    switch (artifactType) {
      case 'lean-canvas':
        return `Analyze this Lean Canvas:\n${JSON.stringify(content, null, 2)}\n\nProvide specific, actionable feedback on:\n1. Clarity and uniqueness of the value proposition\n2. Problem-solution fit\n3. Market positioning\n4. Revenue model viability`;

      case 'swot':
        return `Analyze this SWOT analysis:\n${JSON.stringify(content, null, 2)}\n\nProvide insights on:\n1. Missing critical factors\n2. Opportunities to leverage strengths\n3. Strategies to address weaknesses\n4. Threats mitigation`;

      case 'roadmap':
        return `Analyze this product roadmap:\n${JSON.stringify(content, null, 2)}\n\nProvide feedback on:\n1. Milestone prioritization\n2. Timeline realism\n3. Dependencies and risks\n4. Alignment with business goals`;

      default:
        return `Analyze this content:\n${JSON.stringify(content, null, 2)}\n\nProvide constructive feedback and suggestions for improvement.`;
    }
  }
}

export const aiService = new AIService();
