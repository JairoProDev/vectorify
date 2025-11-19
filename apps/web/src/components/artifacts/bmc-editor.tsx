'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Sparkles, Plus } from 'lucide-react';

interface BMCData {
  keyPartners?: string[];
  keyActivities?: string[];
  keyResources?: string[];
  valuePropositions?: string[];
  customerRelationships?: string[];
  channels?: string[];
  customerSegments?: string[];
  costStructure?: string[];
  revenueStreams?: string[];
}

interface BMCEditorProps {
  data?: BMCData;
  onSave?: (data: BMCData) => void;
  readOnly?: boolean;
}

export function BMCEditor({ data, onSave, readOnly = false }: BMCEditorProps) {
  const [bmcData, setBmcData] = useState<BMCData>(data || {});
  const [hasChanges, setHasChanges] = useState(false);

  const addItem = (field: keyof BMCData) => {
    const current = (bmcData[field] as string[]) || [];
    setBmcData((prev) => ({ ...prev, [field]: [...current, ''] }));
    setHasChanges(true);
  };

  const updateItem = (field: keyof BMCData, index: number, value: string) => {
    const current = (bmcData[field] as string[]) || [];
    const updated = [...current];
    updated[index] = value;
    setBmcData((prev) => ({ ...prev, [field]: updated }));
    setHasChanges(true);
  };

  const removeItem = (field: keyof BMCData, index: number) => {
    const current = (bmcData[field] as string[]) || [];
    setBmcData((prev) => ({
      ...prev,
      [field]: current.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(bmcData);
      setHasChanges(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Model Canvas</h2>
          <p className="text-sm text-muted-foreground">
            Design your business model visually
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
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

      {/* BMC Grid */}
      <div className="grid grid-cols-5 gap-4">
        {/* Column 1 */}
        <div className="space-y-4">
          <BMCBlock
            title="Key Partners"
            items={bmcData.keyPartners || []}
            onAdd={() => addItem('keyPartners')}
            onUpdate={(i, v) => updateItem('keyPartners', i, v)}
            onRemove={(i) => removeItem('keyPartners', i)}
            readOnly={readOnly}
            color="purple"
          />
          <BMCBlock
            title="Key Activities"
            items={bmcData.keyActivities || []}
            onAdd={() => addItem('keyActivities')}
            onUpdate={(i, v) => updateItem('keyActivities', i, v)}
            onRemove={(i) => removeItem('keyActivities', i)}
            readOnly={readOnly}
            color="purple"
          />
          <BMCBlock
            title="Key Resources"
            items={bmcData.keyResources || []}
            onAdd={() => addItem('keyResources')}
            onUpdate={(i, v) => updateItem('keyResources', i, v)}
            onRemove={(i) => removeItem('keyResources', i)}
            readOnly={readOnly}
            color="purple"
          />
        </div>

        {/* Column 2 */}
        <div className="row-span-2">
          <BMCBlock
            title="Value Propositions"
            items={bmcData.valuePropositions || []}
            onAdd={() => addItem('valuePropositions')}
            onUpdate={(i, v) => updateItem('valuePropositions', i, v)}
            onRemove={(i) => removeItem('valuePropositions', i)}
            readOnly={readOnly}
            color="blue"
            tall
          />
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          <BMCBlock
            title="Customer Relationships"
            items={bmcData.customerRelationships || []}
            onAdd={() => addItem('customerRelationships')}
            onUpdate={(i, v) => updateItem('customerRelationships', i, v)}
            onRemove={(i) => removeItem('customerRelationships', i)}
            readOnly={readOnly}
            color="orange"
          />
          <BMCBlock
            title="Channels"
            items={bmcData.channels || []}
            onAdd={() => addItem('channels')}
            onUpdate={(i, v) => updateItem('channels', i, v)}
            onRemove={(i) => removeItem('channels', i)}
            readOnly={readOnly}
            color="orange"
          />
        </div>

        {/* Column 4-5 */}
        <div className="col-span-2">
          <BMCBlock
            title="Customer Segments"
            items={bmcData.customerSegments || []}
            onAdd={() => addItem('customerSegments')}
            onUpdate={(i, v) => updateItem('customerSegments', i, v)}
            onRemove={(i) => removeItem('customerSegments', i)}
            readOnly={readOnly}
            color="green"
            tall
          />
        </div>

        {/* Bottom Row */}
        <div className="col-span-2">
          <BMCBlock
            title="Cost Structure"
            items={bmcData.costStructure || []}
            onAdd={() => addItem('costStructure')}
            onUpdate={(i, v) => updateItem('costStructure', i, v)}
            onRemove={(i) => removeItem('costStructure', i)}
            readOnly={readOnly}
            color="red"
          />
        </div>

        <div className="col-span-3">
          <BMCBlock
            title="Revenue Streams"
            items={bmcData.revenueStreams || []}
            onAdd={() => addItem('revenueStreams')}
            onUpdate={(i, v) => updateItem('revenueStreams', i, v)}
            onRemove={(i) => removeItem('revenueStreams', i)}
            readOnly={readOnly}
            color="green"
          />
        </div>
      </div>
    </div>
  );
}

function BMCBlock({
  title,
  items,
  onAdd,
  onUpdate,
  onRemove,
  readOnly,
  color,
  tall = false,
}: {
  title: string;
  items: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  readOnly: boolean;
  color: 'purple' | 'blue' | 'orange' | 'green' | 'red';
  tall?: boolean;
}) {
  const colorClasses = {
    purple: 'border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950',
    blue: 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950',
    orange: 'border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950',
    green: 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950',
    red: 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950',
  };

  return (
    <Card className={`${colorClasses[color]} ${tall ? 'min-h-[400px]' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={`Add ${title.toLowerCase()}...`}
              disabled={readOnly}
              className="flex-1 bg-background"
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
            Add
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
