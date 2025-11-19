'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Sparkles, Plus, X, User } from 'lucide-react';

interface UserPersonaData {
  name?: string;
  age?: string;
  occupation?: string;
  location?: string;
  imageUrl?: string;
  bio?: string;
  demographics?: {
    education?: string;
    income?: string;
    familyStatus?: string;
  };
  psychographics?: {
    personality?: string;
    values?: string[];
    interests?: string[];
    lifestyle?: string;
  };
  goals?: string[];
  painPoints?: string[];
  motivations?: string[];
  frustrations?: string[];
  preferredChannels?: string[];
  brands?: string[];
  quote?: string;
}

interface UserPersonaEditorProps {
  data?: UserPersonaData;
  onSave?: (data: UserPersonaData) => void;
  readOnly?: boolean;
}

export function UserPersonaEditor({
  data,
  onSave,
  readOnly = false,
}: UserPersonaEditorProps) {
  const [personaData, setPersonaData] = useState<UserPersonaData>(data || {});
  const [hasChanges, setHasChanges] = useState(false);

  const updateField = (field: keyof UserPersonaData, value: any) => {
    setPersonaData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateNestedField = (
    parent: keyof UserPersonaData,
    field: string,
    value: any
  ) => {
    setPersonaData((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as any), [field]: value },
    }));
    setHasChanges(true);
  };

  const addArrayItem = (field: keyof UserPersonaData) => {
    const currentArray = (personaData[field] as string[]) || [];
    setPersonaData((prev) => ({
      ...prev,
      [field]: [...currentArray, ''],
    }));
    setHasChanges(true);
  };

  const updateArrayItem = (
    field: keyof UserPersonaData,
    index: number,
    value: string
  ) => {
    const currentArray = (personaData[field] as string[]) || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setPersonaData((prev) => ({ ...prev, [field]: newArray }));
    setHasChanges(true);
  };

  const removeArrayItem = (field: keyof UserPersonaData, index: number) => {
    const currentArray = (personaData[field] as string[]) || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setPersonaData((prev) => ({ ...prev, [field]: newArray }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(personaData);
      setHasChanges(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">User Persona</h1>
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

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={personaData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Sarah Johnson"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                value={personaData.age || ''}
                onChange={(e) => updateField('age', e.target.value)}
                placeholder="e.g., 32"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Occupation</Label>
              <Input
                value={personaData.occupation || ''}
                onChange={(e) => updateField('occupation', e.target.value)}
                placeholder="e.g., Product Manager"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={personaData.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="e.g., San Francisco, CA"
                disabled={readOnly}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              value={personaData.bio || ''}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Brief description of this persona..."
              rows={3}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Quote</Label>
            <Input
              value={personaData.quote || ''}
              onChange={(e) => updateField('quote', e.target.value)}
              placeholder="A characteristic quote from this persona"
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Demographics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Education</Label>
              <Input
                value={personaData.demographics?.education || ''}
                onChange={(e) =>
                  updateNestedField('demographics', 'education', e.target.value)
                }
                placeholder="e.g., Bachelor's in Business"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Income Level</Label>
              <Input
                value={personaData.demographics?.income || ''}
                onChange={(e) =>
                  updateNestedField('demographics', 'income', e.target.value)
                }
                placeholder="e.g., $80-120k/year"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Family Status</Label>
              <Input
                value={personaData.demographics?.familyStatus || ''}
                onChange={(e) =>
                  updateNestedField('demographics', 'familyStatus', e.target.value)
                }
                placeholder="e.g., Married with 2 kids"
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Psychographics */}
      <Card>
        <CardHeader>
          <CardTitle>Psychographics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Personality</Label>
            <Input
              value={personaData.psychographics?.personality || ''}
              onChange={(e) =>
                updateNestedField('psychographics', 'personality', e.target.value)
              }
              placeholder="e.g., Analytical, driven, detail-oriented"
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Lifestyle</Label>
            <Textarea
              value={personaData.psychographics?.lifestyle || ''}
              onChange={(e) =>
                updateNestedField('psychographics', 'lifestyle', e.target.value)
              }
              placeholder="Describe their typical day, habits, routines..."
              rows={3}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Values</Label>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const values = personaData.psychographics?.values || [];
                    updateNestedField('psychographics', 'values', [...values, '']);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {(personaData.psychographics?.values || []).map((value, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={value}
                    onChange={(e) => {
                      const values = [...(personaData.psychographics?.values || [])];
                      values[index] = e.target.value;
                      updateNestedField('psychographics', 'values', values);
                    }}
                    placeholder="e.g., Innovation, Efficiency"
                    disabled={readOnly}
                  />
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const values = (personaData.psychographics?.values || []).filter(
                          (_, i) => i !== index
                        );
                        updateNestedField('psychographics', 'values', values);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals & Pain Points */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Goals</CardTitle>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('goals')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(personaData.goals || []).map((goal, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={goal}
                  onChange={(e) => updateArrayItem('goals', index, e.target.value)}
                  placeholder="Enter a goal..."
                  disabled={readOnly}
                />
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('goals', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pain Points</CardTitle>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('painPoints')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(personaData.painPoints || []).map((pain, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={pain}
                  onChange={(e) =>
                    updateArrayItem('painPoints', index, e.target.value)
                  }
                  placeholder="Enter a pain point..."
                  disabled={readOnly}
                />
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('painPoints', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Motivations & Frustrations */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Motivations</CardTitle>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('motivations')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(personaData.motivations || []).map((motivation, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={motivation}
                  onChange={(e) =>
                    updateArrayItem('motivations', index, e.target.value)
                  }
                  placeholder="What motivates them..."
                  disabled={readOnly}
                />
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('motivations', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Frustrations</CardTitle>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('frustrations')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(personaData.frustrations || []).map((frustration, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={frustration}
                  onChange={(e) =>
                    updateArrayItem('frustrations', index, e.target.value)
                  }
                  placeholder="What frustrates them..."
                  disabled={readOnly}
                />
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('frustrations', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Behavior & Preferences */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Preferred Channels</CardTitle>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('preferredChannels')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(personaData.preferredChannels || []).map((channel, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={channel}
                  onChange={(e) =>
                    updateArrayItem('preferredChannels', index, e.target.value)
                  }
                  placeholder="e.g., LinkedIn, Email"
                  disabled={readOnly}
                />
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('preferredChannels', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Brands They Use</CardTitle>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('brands')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(personaData.brands || []).map((brand, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={brand}
                  onChange={(e) => updateArrayItem('brands', index, e.target.value)}
                  placeholder="e.g., Apple, Notion"
                  disabled={readOnly}
                />
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('brands', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
