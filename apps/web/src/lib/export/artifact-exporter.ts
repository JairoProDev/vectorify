/**
 * Artifact Export System
 * Exports artifacts to various formats: JSON, Markdown, CSV
 */

export type ExportFormat = 'json' | 'markdown' | 'csv' | 'txt';

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  fileName?: string;
}

export class ArtifactExporter {
  /**
   * Export artifact to specified format
   */
  static async export(
    artifact: any,
    options: ExportOptions
  ): Promise<{ content: string; mimeType: string; fileName: string }> {
    const { format, includeMetadata = true, fileName } = options;

    const defaultFileName = `${artifact.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}`;

    switch (format) {
      case 'json':
        return this.exportJSON(artifact, includeMetadata, fileName || `${defaultFileName}.json`);
      case 'markdown':
        return this.exportMarkdown(artifact, includeMetadata, fileName || `${defaultFileName}.md`);
      case 'csv':
        return this.exportCSV(artifact, includeMetadata, fileName || `${defaultFileName}.csv`);
      case 'txt':
        return this.exportText(artifact, includeMetadata, fileName || `${defaultFileName}.txt`);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Export as JSON
   */
  private static exportJSON(
    artifact: any,
    includeMetadata: boolean,
    fileName: string
  ): { content: string; mimeType: string; fileName: string } {
    const data = includeMetadata
      ? artifact
      : {
          name: artifact.name,
          type: artifact.type,
          content: artifact.content,
        };

    return {
      content: JSON.stringify(data, null, 2),
      mimeType: 'application/json',
      fileName,
    };
  }

  /**
   * Export as Markdown
   */
  private static exportMarkdown(
    artifact: any,
    includeMetadata: boolean,
    fileName: string
  ): { content: string; mimeType: string; fileName: string } {
    let markdown = `# ${artifact.name}\n\n`;

    if (includeMetadata) {
      markdown += `**Type:** ${artifact.type}\n`;
      markdown += `**Created:** ${new Date(artifact.createdAt).toLocaleString()}\n`;
      markdown += `**Updated:** ${new Date(artifact.updatedAt).toLocaleString()}\n\n`;
      markdown += `---\n\n`;
    }

    // Convert content based on type
    markdown += this.contentToMarkdown(artifact.type, artifact.content);

    return {
      content: markdown,
      mimeType: 'text/markdown',
      fileName,
    };
  }

  /**
   * Export as CSV (for structured data)
   */
  private static exportCSV(
    artifact: any,
    includeMetadata: boolean,
    fileName: string
  ): { content: string; mimeType: string; fileName: string } {
    let csv = '';

    // Add metadata header if requested
    if (includeMetadata) {
      csv += 'Artifact Metadata\n';
      csv += `Name,${artifact.name}\n`;
      csv += `Type,${artifact.type}\n`;
      csv += `Created,${new Date(artifact.createdAt).toLocaleString()}\n`;
      csv += `Updated,${new Date(artifact.updatedAt).toLocaleString()}\n\n`;
    }

    // Convert content to CSV based on type
    csv += this.contentToCSV(artifact.type, artifact.content);

    return {
      content: csv,
      mimeType: 'text/csv',
      fileName,
    };
  }

  /**
   * Export as plain text
   */
  private static exportText(
    artifact: any,
    includeMetadata: boolean,
    fileName: string
  ): { content: string; mimeType: string; fileName: string } {
    let text = `${artifact.name}\n${'='.repeat(artifact.name.length)}\n\n`;

    if (includeMetadata) {
      text += `Type: ${artifact.type}\n`;
      text += `Created: ${new Date(artifact.createdAt).toLocaleString()}\n`;
      text += `Updated: ${new Date(artifact.updatedAt).toLocaleString()}\n\n`;
      text += `${'-'.repeat(50)}\n\n`;
    }

    text += this.contentToText(artifact.type, artifact.content);

    return {
      content: text,
      mimeType: 'text/plain',
      fileName,
    };
  }

  /**
   * Convert artifact content to Markdown based on type
   */
  private static contentToMarkdown(type: string, content: any): string {
    switch (type) {
      case 'lean-canvas':
        return this.leanCanvasToMarkdown(content);
      case 'bmc':
        return this.bmcToMarkdown(content);
      case 'swot':
        return this.swotToMarkdown(content);
      case 'user-persona':
        return this.personaToMarkdown(content);
      case 'competitor-analysis':
        return this.competitorToMarkdown(content);
      case 'vision-mission':
        return this.visionMissionToMarkdown(content);
      default:
        return `\`\`\`json\n${JSON.stringify(content, null, 2)}\n\`\`\`\n`;
    }
  }

  private static leanCanvasToMarkdown(content: any): string {
    let md = '## Lean Canvas\n\n';

    const sections = [
      { key: 'problem', title: 'Problem' },
      { key: 'solution', title: 'Solution' },
      { key: 'uniqueValueProposition', title: 'Unique Value Proposition' },
      { key: 'unfairAdvantage', title: 'Unfair Advantage' },
      { key: 'customerSegments', title: 'Customer Segments' },
      { key: 'keyMetrics', title: 'Key Metrics' },
      { key: 'channels', title: 'Channels' },
      { key: 'costStructure', title: 'Cost Structure' },
      { key: 'revenueStreams', title: 'Revenue Streams' },
    ];

    sections.forEach(({ key, title }) => {
      if (content[key]) {
        md += `### ${title}\n\n`;
        if (Array.isArray(content[key])) {
          content[key].forEach((item: string) => md += `- ${item}\n`);
        } else {
          md += `${content[key]}\n`;
        }
        md += '\n';
      }
    });

    return md;
  }

  private static bmcToMarkdown(content: any): string {
    let md = '## Business Model Canvas\n\n';

    const sections = [
      { key: 'keyPartners', title: 'Key Partners' },
      { key: 'keyActivities', title: 'Key Activities' },
      { key: 'keyResources', title: 'Key Resources' },
      { key: 'valuePropositions', title: 'Value Propositions' },
      { key: 'customerRelationships', title: 'Customer Relationships' },
      { key: 'channels', title: 'Channels' },
      { key: 'customerSegments', title: 'Customer Segments' },
      { key: 'costStructure', title: 'Cost Structure' },
      { key: 'revenueStreams', title: 'Revenue Streams' },
    ];

    sections.forEach(({ key, title }) => {
      if (content[key] && content[key].length > 0) {
        md += `### ${title}\n\n`;
        content[key].forEach((item: string) => md += `- ${item}\n`);
        md += '\n';
      }
    });

    return md;
  }

  private static swotToMarkdown(content: any): string {
    let md = '## SWOT Analysis\n\n';

    if (content.strengths?.length) {
      md += '### Strengths\n\n';
      content.strengths.forEach((item: string) => md += `- ${item}\n`);
      md += '\n';
    }

    if (content.weaknesses?.length) {
      md += '### Weaknesses\n\n';
      content.weaknesses.forEach((item: string) => md += `- ${item}\n`);
      md += '\n';
    }

    if (content.opportunities?.length) {
      md += '### Opportunities\n\n';
      content.opportunities.forEach((item: string) => md += `- ${item}\n`);
      md += '\n';
    }

    if (content.threats?.length) {
      md += '### Threats\n\n';
      content.threats.forEach((item: string) => md += `- ${item}\n`);
      md += '\n';
    }

    return md;
  }

  private static personaToMarkdown(content: any): string {
    let md = '## User Persona\n\n';

    if (content.name) md += `**Name:** ${content.name}\n`;
    if (content.age) md += `**Age:** ${content.age}\n`;
    if (content.occupation) md += `**Occupation:** ${content.occupation}\n`;
    if (content.location) md += `**Location:** ${content.location}\n\n`;

    if (content.bio) md += `### Bio\n\n${content.bio}\n\n`;

    if (content.goals?.length) {
      md += '### Goals\n\n';
      content.goals.forEach((goal: string) => md += `- ${goal}\n`);
      md += '\n';
    }

    if (content.painPoints?.length) {
      md += '### Pain Points\n\n';
      content.painPoints.forEach((pain: string) => md += `- ${pain}\n`);
      md += '\n';
    }

    return md;
  }

  private static competitorToMarkdown(content: any): string {
    let md = '## Competitor Analysis\n\n';

    if (content.yourProduct) {
      md += '### Your Product\n\n';
      md += `**Name:** ${content.yourProduct.name || 'N/A'}\n`;
      md += `**Unique Value:** ${content.yourProduct.uniqueValue || 'N/A'}\n\n`;
    }

    if (content.competitors?.length) {
      md += '### Competitors\n\n';
      content.competitors.forEach((comp: any) => {
        md += `#### ${comp.name}\n\n`;
        if (comp.description) md += `${comp.description}\n\n`;
        if (comp.strengths?.length) {
          md += '**Strengths:**\n';
          comp.strengths.forEach((s: string) => md += `- ${s}\n`);
          md += '\n';
        }
        if (comp.weaknesses?.length) {
          md += '**Weaknesses:**\n';
          comp.weaknesses.forEach((w: string) => md += `- ${w}\n`);
          md += '\n';
        }
      });
    }

    return md;
  }

  private static visionMissionToMarkdown(content: any): string {
    let md = '## Vision & Mission\n\n';

    if (content.vision) {
      md += '### Vision\n\n';
      md += `${content.vision}\n\n`;
    }

    if (content.mission) {
      md += '### Mission\n\n';
      md += `${content.mission}\n\n`;
    }

    if (content.coreValues?.length) {
      md += '### Core Values\n\n';
      content.coreValues.forEach((value: string) => md += `- ${value}\n`);
      md += '\n';
    }

    return md;
  }

  /**
   * Convert content to CSV (simplified)
   */
  private static contentToCSV(type: string, content: any): string {
    return `Content\n${JSON.stringify(content)}\n`;
  }

  /**
   * Convert content to plain text
   */
  private static contentToText(type: string, content: any): string {
    // Remove markdown formatting for plain text
    return this.contentToMarkdown(type, content)
      .replace(/^#+\s/gm, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '');
  }

  /**
   * Download exported content as file
   */
  static download(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
