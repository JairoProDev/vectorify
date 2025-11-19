'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamic imports para lazy loading
const LeanCanvasEditor = dynamic(
  () => import('./lean-canvas-editor').then((mod) => ({ default: mod.LeanCanvasEditor })),
  {
    loading: () => <EditorSkeleton />,
  }
);

const BMCEditor = dynamic(
  () => import('./bmc-editor').then((mod) => ({ default: mod.BMCEditor })),
  {
    loading: () => <EditorSkeleton />,
  }
);

const SWOTMatrix = dynamic(
  () => import('./swot-matrix').then((mod) => ({ default: mod.SWOTMatrix })),
  {
    loading: () => <EditorSkeleton />,
  }
);

const RoadmapEditor = dynamic(
  () => import('./roadmap-editor').then((mod) => ({ default: mod.RoadmapEditor })),
  {
    loading: () => <EditorSkeleton />,
  }
);

interface ArtifactRendererProps {
  type: string;
  data: any;
  onSave?: (data: any) => void;
  readOnly?: boolean;
}

export function ArtifactRenderer({ type, data, onSave, readOnly }: ArtifactRendererProps) {
  switch (type) {
    case 'lean-canvas':
      return <LeanCanvasEditor data={data} onSave={onSave} readOnly={readOnly} />;

    case 'bmc':
    case 'business-model-canvas':
      return <BMCEditor data={data} onSave={onSave} readOnly={readOnly} />;

    case 'swot':
    case 'swot-analysis':
      return <SWOTMatrix data={data} onSave={onSave} readOnly={readOnly} />;

    case 'roadmap':
    case 'product-roadmap':
      return <RoadmapEditor data={data} onSave={onSave} readOnly={readOnly} />;

    default:
      return <DefaultEditor data={data} onSave={onSave} readOnly={readOnly} />;
  }
}

function EditorSkeleton() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

function DefaultEditor({ data, onSave, readOnly }: any) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Document</h2>
        <p className="text-sm text-muted-foreground">
          Generic document editor
        </p>
      </div>
      <textarea
        className="w-full min-h-[400px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Start writing..."
        value={typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        onChange={(e) => onSave && onSave(e.target.value)}
        disabled={readOnly}
      />
    </div>
  );
}
