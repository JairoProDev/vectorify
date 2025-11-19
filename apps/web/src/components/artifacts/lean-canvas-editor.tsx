'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Save, Sparkles } from 'lucide-react';

interface LeanCanvasData {
  problem?: string[];
  solution?: string[];
  uniqueValueProposition?: string;
  unfairAdvantage?: string;
  customerSegments?: string[];
  keyMetrics?: string[];
  channels?: string[];
  costStructure?: string[];
  revenueStreams?: string[];
}

interface LeanCanvasEditorProps {
  data?: LeanCanvasData;
  onSave?: (data: LeanCanvasData) => void;
  readOnly?: boolean;
}

export function LeanCanvasEditor({ data, onSave, readOnly = false }: LeanCanvasEditorProps) {
  const [canvasData, setCanvasData] = useState<LeanCanvasData>(data || {});
  const [hasChanges, setHasChanges] = useState(false);

  const updateField = (field: keyof LeanCanvasData, value: any) => {
    setCanvasData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const addItem = (field: keyof LeanCanvasData) => {
    const current = (canvasData[field] as string[]) || [];
    updateField(field, [...current, '']);
  };

  const updateItem = (field: keyof LeanCanvasData, index: number, value: string) => {
    const current = (canvasData[field] as string[]) || [];
    const updated = [...current];
    updated[index] = value;
    updateField(field, updated);
  };

  const removeItem = (field: keyof LeanCanvasData, index: number) => {
    const current = (canvasData[field] as string[]) || [];
    updateField(
      field,
      current.filter((_, i) => i !== index)
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave(canvasData);
      setHasChanges(false);
    }
  };

  const handleAIAssist = () => {
    // TODO: Integrate with AI Copilot
    console.log('AI Assist requested for Lean Canvas');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lean Canvas</h2>
          <p className="text-sm text-muted-foreground">
            Define your business model in one page
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleAIAssist}>
            <Sparkles className="mr-2 h-4 w-4" />
            AI Assist
          </Button>
          {!readOnly && (
            <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              {hasChanges ? 'Save Changes' : 'Saved'}
            </Button>
          )}
        </div>
      </div>

      {/* Canvas Grid */}
      <div className="grid grid-cols-5 gap-4">
        {/* Row 1 */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Problem</CardTitle>
          </CardHeader>
          <CardContent>
            <ListField
              items={canvasData.problem || []}
              onAdd={() => addItem('problem')}
              onUpdate={(i, v) => updateItem('problem', i, v)}
              onRemove={(i) => removeItem('problem', i)}
              readOnly={readOnly}
              placeholder="Top 3 problems..."
            />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <ListField
              items={canvasData.solution || []}
              onAdd={() => addItem('solution')}
              onUpdate={(i, v) => updateItem('solution', i, v)}
              onRemove={(i) => removeItem('solution', i)}
              readOnly={readOnly}
              placeholder="Top 3 features..."
            />
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Unique Value Proposition</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Single, clear, compelling message..."
              value={canvasData.uniqueValueProposition || ''}
              onChange={(e) => updateField('uniqueValueProposition', e.target.value)}
              disabled={readOnly}
            />
          </CardContent>
        </Card>

        {/* Row 2 */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Unfair Advantage</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Can't be easily copied or bought..."
              value={canvasData.unfairAdvantage || ''}
              onChange={(e) => updateField('unfairAdvantage', e.target.value)}
              disabled={readOnly}
            />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ListField
              items={canvasData.keyMetrics || []}
              onAdd={() => addItem('keyMetrics')}
              onUpdate={(i, v) => updateItem('keyMetrics', i, v)}
              onRemove={(i) => removeItem('keyMetrics', i)}
              readOnly={readOnly}
              placeholder="Key activities you measure..."
            />
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <ListField
              items={canvasData.customerSegments || []}
              onAdd={() => addItem('customerSegments')}
              onUpdate={(i, v) => updateItem('customerSegments', i, v)}
              onRemove={(i) => removeItem('customerSegments', i)}
              readOnly={readOnly}
              placeholder="Target customers..."
            />
          </CardContent>
        </Card>

        {/* Row 3 */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <ListField
              items={canvasData.channels || []}
              onAdd={() => addItem('channels')}
              onUpdate={(i, v) => updateItem('channels', i, v)}
              onRemove={(i) => removeItem('channels', i)}
              readOnly={readOnly}
              placeholder="Path to customers..."
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Cost Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <ListField
              items={canvasData.costStructure || []}
              onAdd={() => addItem('costStructure')}
              onUpdate={(i, v) => updateItem('costStructure', i, v)}
              onRemove={(i) => removeItem('costStructure', i)}
              readOnly={readOnly}
              placeholder="Customer acquisition costs, distribution costs, hosting, people..."
            />
          </CardContent>
        </Card>

        {/* Row 4 */}
        <Card className="col-span-5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Revenue Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <ListField
              items={canvasData.revenueStreams || []}
              onAdd={() => addItem('revenueStreams')}
              onUpdate={(i, v) => updateItem('revenueStreams', i, v)}
              onRemove={(i) => removeItem('revenueStreams', i)}
              readOnly={readOnly}
              placeholder="Revenue model, lifetime value, revenue, gross margin..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper component for list fields
function ListField({
  items,
  onAdd,
  onUpdate,
  onRemove,
  readOnly,
  placeholder,
}: {
  items: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  readOnly: boolean;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={placeholder}
            disabled={readOnly}
            className="flex-1"
          />
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="px-2"
            >
              ×
            </Button>
          )}
        </div>
      ))}
      {!readOnly && (
        <Button variant="outline" size="sm" onClick={onAdd} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      )}
    </div>
  );
}
