'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Save, Sparkles, Target, Eye, Plus, X } from 'lucide-react';

interface VisionMissionData {
  vision?: string;
  mission?: string;
  purpose?: string;
  coreValues?: string[];
  longTermGoals?: string[];
  impact?: string;
  targetYear?: string;
  keyPrinciples?: string[];
}

interface VisionMissionEditorProps {
  data?: VisionMissionData;
  onSave?: (data: VisionMissionData) => void;
  readOnly?: boolean;
}

export function VisionMissionEditor({
  data,
  onSave,
  readOnly = false,
}: VisionMissionEditorProps) {
  const [visionData, setVisionData] = useState<VisionMissionData>(data || {});
  const [hasChanges, setHasChanges] = useState(false);

  const updateField = (field: keyof VisionMissionData, value: any) => {
    setVisionData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const addArrayItem = (field: keyof VisionMissionData) => {
    const currentArray = (visionData[field] as string[]) || [];
    setVisionData((prev) => ({
      ...prev,
      [field]: [...currentArray, ''],
    }));
    setHasChanges(true);
  };

  const updateArrayItem = (
    field: keyof VisionMissionData,
    index: number,
    value: string
  ) => {
    const currentArray = (visionData[field] as string[]) || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setVisionData((prev) => ({ ...prev, [field]: newArray }));
    setHasChanges(true);
  };

  const removeArrayItem = (field: keyof VisionMissionData, index: number) => {
    const currentArray = (visionData[field] as string[]) || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setVisionData((prev) => ({ ...prev, [field]: newArray }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(visionData);
      setHasChanges(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Vision & Mission</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Assist
          </Button>
          {!readOnly && (
            <Button onClick={handleSave} disabled={!hasChanges} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Vision Statement */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <CardTitle>Vision Statement</CardTitle>
          </div>
          <CardDescription>
            What do you want to become? Where do you see the organization in 5-10 years?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Vision</Label>
            <Textarea
              value={visionData.vision || ''}
              onChange={(e) => updateField('vision', e.target.value)}
              placeholder="Our vision is to..."
              rows={4}
              disabled={readOnly}
              className="bg-white dark:bg-gray-950"
            />
            <p className="text-xs text-muted-foreground">
              Tip: A good vision is inspirational, aspirational, and paints a picture of the future.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Target Year</Label>
            <Input
              value={visionData.targetYear || ''}
              onChange={(e) => updateField('targetYear', e.target.value)}
              placeholder="e.g., 2030"
              disabled={readOnly}
              className="bg-white dark:bg-gray-950"
            />
          </div>
        </CardContent>
      </Card>

      {/* Mission Statement */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            <CardTitle>Mission Statement</CardTitle>
          </div>
          <CardDescription>
            What do you do? Who do you serve? How do you create value?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Mission</Label>
            <Textarea
              value={visionData.mission || ''}
              onChange={(e) => updateField('mission', e.target.value)}
              placeholder="Our mission is to..."
              rows={4}
              disabled={readOnly}
              className="bg-white dark:bg-gray-950"
            />
            <p className="text-xs text-muted-foreground">
              Tip: A good mission is clear, actionable, and defines your purpose today.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Purpose */}
      <Card>
        <CardHeader>
          <CardTitle>Purpose</CardTitle>
          <CardDescription>
            Why does the organization exist? What problem are you solving?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={visionData.purpose || ''}
            onChange={(e) => updateField('purpose', e.target.value)}
            placeholder="We exist to..."
            rows={3}
            disabled={readOnly}
          />
        </CardContent>
      </Card>

      {/* Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Desired Impact</CardTitle>
          <CardDescription>
            What change do you want to create in the world?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={visionData.impact || ''}
            onChange={(e) => updateField('impact', e.target.value)}
            placeholder="We will impact the world by..."
            rows={3}
            disabled={readOnly}
          />
        </CardContent>
      </Card>

      {/* Core Values */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Core Values</CardTitle>
              <CardDescription>
                What principles guide your decisions and actions?
              </CardDescription>
            </div>
            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('coreValues')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Value
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(visionData.coreValues || []).map((value, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={value}
                  onChange={(e) =>
                    updateArrayItem('coreValues', index, e.target.value)
                  }
                  placeholder="e.g., Innovation, Integrity, Customer First"
                  disabled={readOnly}
                />
              </div>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('coreValues', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {(visionData.coreValues || []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No core values added yet. Click "Add Value" to get started.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Long-term Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Long-term Goals</CardTitle>
              <CardDescription>
                What are the major milestones on the path to your vision?
              </CardDescription>
            </div>
            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('longTermGoals')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Goal
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(visionData.longTermGoals || []).map((goal, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={goal}
                  onChange={(e) =>
                    updateArrayItem('longTermGoals', index, e.target.value)
                  }
                  placeholder="e.g., Reach 1M users by 2026"
                  disabled={readOnly}
                />
              </div>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('longTermGoals', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {(visionData.longTermGoals || []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No long-term goals added yet. Click "Add Goal" to get started.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Key Principles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Key Principles</CardTitle>
              <CardDescription>
                What are the fundamental truths that guide your strategy?
              </CardDescription>
            </div>
            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('keyPrinciples')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Principle
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(visionData.keyPrinciples || []).map((principle, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={principle}
                  onChange={(e) =>
                    updateArrayItem('keyPrinciples', index, e.target.value)
                  }
                  placeholder="e.g., Start with the customer and work backwards"
                  disabled={readOnly}
                />
              </div>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('keyPrinciples', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {(visionData.keyPrinciples || []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No principles added yet. Click "Add Principle" to get started.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Examples Section */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">Examples from Great Companies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-semibold">Tesla:</p>
            <p className="text-muted-foreground italic">
              "To accelerate the world's transition to sustainable energy."
            </p>
          </div>
          <div>
            <p className="font-semibold">Airbnb:</p>
            <p className="text-muted-foreground italic">
              "Create a world where anyone can belong anywhere."
            </p>
          </div>
          <div>
            <p className="font-semibold">Notion:</p>
            <p className="text-muted-foreground italic">
              "Make it possible for everyone to shape the tools that shape their lives."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
