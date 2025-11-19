'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Sparkles, Plus } from 'lucide-react';

interface SWOTData {
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
}

interface SWOTMatrixProps {
  data?: SWOTData;
  onSave?: (data: SWOTData) => void;
  readOnly?: boolean;
}

export function SWOTMatrix({ data, onSave, readOnly = false }: SWOTMatrixProps) {
  const [swotData, setSwotData] = useState<SWOTData>(data || {});
  const [hasChanges, setHasChanges] = useState(false);

  const addItem = (category: keyof SWOTData) => {
    const current = (swotData[category] as string[]) || [];
    setSwotData((prev) => ({ ...prev, [category]: [...current, ''] }));
    setHasChanges(true);
  };

  const updateItem = (category: keyof SWOTData, index: number, value: string) => {
    const current = (swotData[category] as string[]) || [];
    const updated = [...current];
    updated[index] = value;
    setSwotData((prev) => ({ ...prev, [category]: updated }));
    setHasChanges(true);
  };

  const removeItem = (category: keyof SWOTData, index: number) => {
    const current = (swotData[category] as string[]) || [];
    setSwotData((prev) => ({
      ...prev,
      [category]: current.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(swotData);
      setHasChanges(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SWOT Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Analyze your strategic position
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

      {/* SWOT Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Strengths */}
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="bg-green-50 dark:bg-green-950">
            <CardTitle className="text-green-700 dark:text-green-300">
              💪 Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <SWOTCategory
              items={swotData.strengths || []}
              onAdd={() => addItem('strengths')}
              onUpdate={(i, v) => updateItem('strengths', i, v)}
              onRemove={(i) => removeItem('strengths', i)}
              readOnly={readOnly}
              placeholder="What do you do well?"
            />
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="bg-red-50 dark:bg-red-950">
            <CardTitle className="text-red-700 dark:text-red-300">
              ⚠️ Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <SWOTCategory
              items={swotData.weaknesses || []}
              onAdd={() => addItem('weaknesses')}
              onUpdate={(i, v) => updateItem('weaknesses', i, v)}
              onRemove={(i) => removeItem('weaknesses', i)}
              readOnly={readOnly}
              placeholder="What could be improved?"
            />
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader className="bg-blue-50 dark:bg-blue-950">
            <CardTitle className="text-blue-700 dark:text-blue-300">
              🚀 Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <SWOTCategory
              items={swotData.opportunities || []}
              onAdd={() => addItem('opportunities')}
              onUpdate={(i, v) => updateItem('opportunities', i, v)}
              onRemove={(i) => removeItem('opportunities', i)}
              readOnly={readOnly}
              placeholder="What external factors can you exploit?"
            />
          </CardContent>
        </Card>

        {/* Threats */}
        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="bg-orange-50 dark:bg-orange-950">
            <CardTitle className="text-orange-700 dark:text-orange-300">
              ⚡ Threats
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <SWOTCategory
              items={swotData.threats || []}
              onAdd={() => addItem('threats')}
              onUpdate={(i, v) => updateItem('threats', i, v)}
              onRemove={(i) => removeItem('threats', i)}
              readOnly={readOnly}
              placeholder="What external factors could harm you?"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SWOTCategory({
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
          Add
        </Button>
      )}
    </div>
  );
}
