'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileJson, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { ArtifactExporter, ExportFormat } from '@/lib/export/artifact-exporter';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';

interface ExportMenuProps {
  artifact: any;
}

export function ExportMenu({ artifact }: ExportMenuProps) {
  const [exporting, setExporting] = useState(false);
  const { addNotification } = useWorkspaceStore();

  const handleExport = async (format: ExportFormat) => {
    setExporting(true);
    try {
      const { content, mimeType, fileName } = await ArtifactExporter.export(artifact, {
        format,
        includeMetadata: true,
      });

      ArtifactExporter.download(content, fileName, mimeType);

      addNotification({
        type: 'success',
        title: 'Export Successful',
        message: `${artifact.name} exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      addNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export artifact',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={exporting}>
          {exporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="mr-2 h-4 w-4 text-blue-600" />
          <div className="flex-1">
            <div className="font-medium">JSON</div>
            <div className="text-xs text-muted-foreground">Structured data</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport('markdown')}>
          <FileText className="mr-2 h-4 w-4 text-purple-600" />
          <div className="flex-1">
            <div className="font-medium">Markdown</div>
            <div className="text-xs text-muted-foreground">Formatted text</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          <div className="flex-1">
            <div className="font-medium">CSV</div>
            <div className="text-xs text-muted-foreground">Spreadsheet data</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport('txt')}>
          <FileText className="mr-2 h-4 w-4 text-gray-600" />
          <div className="flex-1">
            <div className="font-medium">Plain Text</div>
            <div className="text-xs text-muted-foreground">No formatting</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
