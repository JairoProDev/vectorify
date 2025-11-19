'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Sparkles, Plus, X, TrendingUp, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Competitor {
  id: string;
  name: string;
  website?: string;
  description?: string;
  marketPosition?: 'leader' | 'challenger' | 'follower' | 'nicher';
  strengths?: string[];
  weaknesses?: string[];
  pricing?: string;
  targetMarket?: string;
  keyFeatures?: string[];
  marketShare?: string;
  funding?: string;
  employees?: string;
  founded?: string;
}

interface CompetitorAnalysisData {
  competitors?: Competitor[];
  yourProduct?: {
    name?: string;
    uniqueValue?: string;
    competitiveAdvantages?: string[];
  };
  marketInsights?: string;
  opportunities?: string[];
  threats?: string[];
}

interface CompetitorAnalysisEditorProps {
  data?: CompetitorAnalysisData;
  onSave?: (data: CompetitorAnalysisData) => void;
  readOnly?: boolean;
}

export function CompetitorAnalysisEditor({
  data,
  onSave,
  readOnly = false,
}: CompetitorAnalysisEditorProps) {
  const [analysisData, setAnalysisData] = useState<CompetitorAnalysisData>(
    data || { competitors: [], yourProduct: {}, opportunities: [], threats: [] }
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(
    null
  );

  const updateYourProduct = (field: string, value: any) => {
    setAnalysisData((prev) => ({
      ...prev,
      yourProduct: { ...prev.yourProduct, [field]: value },
    }));
    setHasChanges(true);
  };

  const updateField = (field: keyof CompetitorAnalysisData, value: any) => {
    setAnalysisData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const addCompetitor = () => {
    const newCompetitor: Competitor = {
      id: Date.now().toString(),
      name: '',
      strengths: [],
      weaknesses: [],
      keyFeatures: [],
    };
    setAnalysisData((prev) => ({
      ...prev,
      competitors: [...(prev.competitors || []), newCompetitor],
    }));
    setSelectedCompetitor(newCompetitor.id);
    setHasChanges(true);
  };

  const removeCompetitor = (id: string) => {
    setAnalysisData((prev) => ({
      ...prev,
      competitors: (prev.competitors || []).filter((c) => c.id !== id),
    }));
    if (selectedCompetitor === id) {
      setSelectedCompetitor(null);
    }
    setHasChanges(true);
  };

  const updateCompetitor = (id: string, field: keyof Competitor, value: any) => {
    setAnalysisData((prev) => ({
      ...prev,
      competitors: (prev.competitors || []).map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
    setHasChanges(true);
  };

  const addCompetitorArrayItem = (competitorId: string, field: keyof Competitor) => {
    setAnalysisData((prev) => ({
      ...prev,
      competitors: (prev.competitors || []).map((c) =>
        c.id === competitorId
          ? { ...c, [field]: [...((c[field] as string[]) || []), ''] }
          : c
      ),
    }));
    setHasChanges(true);
  };

  const updateCompetitorArrayItem = (
    competitorId: string,
    field: keyof Competitor,
    index: number,
    value: string
  ) => {
    setAnalysisData((prev) => ({
      ...prev,
      competitors: (prev.competitors || []).map((c) => {
        if (c.id === competitorId) {
          const arr = [...((c[field] as string[]) || [])];
          arr[index] = value;
          return { ...c, [field]: arr };
        }
        return c;
      }),
    }));
    setHasChanges(true);
  };

  const removeCompetitorArrayItem = (
    competitorId: string,
    field: keyof Competitor,
    index: number
  ) => {
    setAnalysisData((prev) => ({
      ...prev,
      competitors: (prev.competitors || []).map((c) => {
        if (c.id === competitorId) {
          const arr = ((c[field] as string[]) || []).filter((_, i) => i !== index);
          return { ...c, [field]: arr };
        }
        return c;
      }),
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(analysisData);
      setHasChanges(false);
    }
  };

  const selectedCompetitorData = (analysisData.competitors || []).find(
    (c) => c.id === selectedCompetitor
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Competitor Analysis</h1>
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

      {/* Your Product */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Your Product</CardTitle>
          <CardDescription>Define your product's position in the market</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              value={analysisData.yourProduct?.name || ''}
              onChange={(e) => updateYourProduct('name', e.target.value)}
              placeholder="Your product/company name"
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Unique Value Proposition</Label>
            <Textarea
              value={analysisData.yourProduct?.uniqueValue || ''}
              onChange={(e) => updateYourProduct('uniqueValue', e.target.value)}
              placeholder="What makes you different from competitors?"
              rows={3}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Competitive Advantages</Label>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const advantages =
                      analysisData.yourProduct?.competitiveAdvantages || [];
                    updateYourProduct('competitiveAdvantages', [
                      ...advantages,
                      '',
                    ]);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {(analysisData.yourProduct?.competitiveAdvantages || []).map(
                (advantage, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={advantage}
                      onChange={(e) => {
                        const advantages = [
                          ...(analysisData.yourProduct?.competitiveAdvantages ||
                            []),
                        ];
                        advantages[index] = e.target.value;
                        updateYourProduct('competitiveAdvantages', advantages);
                      }}
                      placeholder="e.g., Better UX, Lower price, Faster support"
                      disabled={readOnly}
                    />
                    {!readOnly && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const advantages = (
                            analysisData.yourProduct?.competitiveAdvantages || []
                          ).filter((_, i) => i !== index);
                          updateYourProduct('competitiveAdvantages', advantages);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitors List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Competitors</CardTitle>
              <CardDescription>
                Add and analyze your main competitors
              </CardDescription>
            </div>
            {!readOnly && (
              <Button onClick={addCompetitor}>
                <Plus className="h-4 w-4 mr-2" />
                Add Competitor
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {(analysisData.competitors || []).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No competitors added yet.</p>
              <p className="text-sm">Click "Add Competitor" to get started.</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {(analysisData.competitors || []).map((competitor) => (
                <div
                  key={competitor.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCompetitor === competitor.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedCompetitor(competitor.id)}
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {competitor.name || 'Unnamed Competitor'}
                    </p>
                    {competitor.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {competitor.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {competitor.marketPosition && (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                        {competitor.marketPosition}
                      </span>
                    )}
                    {!readOnly && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCompetitor(competitor.id);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Competitor Details */}
      {selectedCompetitorData && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Competitor Details</CardTitle>
            <CardDescription>{selectedCompetitorData.name || 'Competitor'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={selectedCompetitorData.name || ''}
                  onChange={(e) =>
                    updateCompetitor(selectedCompetitorData.id, 'name', e.target.value)
                  }
                  placeholder="Competitor name"
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={selectedCompetitorData.website || ''}
                  onChange={(e) =>
                    updateCompetitor(
                      selectedCompetitorData.id,
                      'website',
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Market Position</Label>
                <Select
                  value={selectedCompetitorData.marketPosition || ''}
                  onValueChange={(value) =>
                    updateCompetitor(
                      selectedCompetitorData.id,
                      'marketPosition',
                      value
                    )
                  }
                  disabled={readOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leader">Market Leader</SelectItem>
                    <SelectItem value="challenger">Challenger</SelectItem>
                    <SelectItem value="follower">Follower</SelectItem>
                    <SelectItem value="nicher">Nicher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Market Share</Label>
                <Input
                  value={selectedCompetitorData.marketShare || ''}
                  onChange={(e) =>
                    updateCompetitor(
                      selectedCompetitorData.id,
                      'marketShare',
                      e.target.value
                    )
                  }
                  placeholder="e.g., 25%"
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={selectedCompetitorData.description || ''}
                onChange={(e) =>
                  updateCompetitor(
                    selectedCompetitorData.id,
                    'description',
                    e.target.value
                  )
                }
                placeholder="Brief description of the competitor..."
                rows={2}
                disabled={readOnly}
              />
            </div>

            {/* Company Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Founded</Label>
                <Input
                  value={selectedCompetitorData.founded || ''}
                  onChange={(e) =>
                    updateCompetitor(
                      selectedCompetitorData.id,
                      'founded',
                      e.target.value
                    )
                  }
                  placeholder="e.g., 2015"
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Employees</Label>
                <Input
                  value={selectedCompetitorData.employees || ''}
                  onChange={(e) =>
                    updateCompetitor(
                      selectedCompetitorData.id,
                      'employees',
                      e.target.value
                    )
                  }
                  placeholder="e.g., 100-500"
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Funding</Label>
                <Input
                  value={selectedCompetitorData.funding || ''}
                  onChange={(e) =>
                    updateCompetitor(
                      selectedCompetitorData.id,
                      'funding',
                      e.target.value
                    )
                  }
                  placeholder="e.g., $50M Series B"
                  disabled={readOnly}
                />
              </div>
            </div>

            {/* Market Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pricing</Label>
                <Input
                  value={selectedCompetitorData.pricing || ''}
                  onChange={(e) =>
                    updateCompetitor(
                      selectedCompetitorData.id,
                      'pricing',
                      e.target.value
                    )
                  }
                  placeholder="e.g., $49/month"
                  disabled={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Market</Label>
                <Input
                  value={selectedCompetitorData.targetMarket || ''}
                  onChange={(e) =>
                    updateCompetitor(
                      selectedCompetitorData.id,
                      'targetMarket',
                      e.target.value
                    )
                  }
                  placeholder="e.g., SMBs, Enterprise"
                  disabled={readOnly}
                />
              </div>
            </div>

            {/* Strengths */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Strengths</Label>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      addCompetitorArrayItem(selectedCompetitorData.id, 'strengths')
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {(selectedCompetitorData.strengths || []).map((strength, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={strength}
                      onChange={(e) =>
                        updateCompetitorArrayItem(
                          selectedCompetitorData.id,
                          'strengths',
                          index,
                          e.target.value
                        )
                      }
                      placeholder="Enter a strength..."
                      disabled={readOnly}
                    />
                    {!readOnly && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeCompetitorArrayItem(
                            selectedCompetitorData.id,
                            'strengths',
                            index
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Weaknesses</Label>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      addCompetitorArrayItem(selectedCompetitorData.id, 'weaknesses')
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {(selectedCompetitorData.weaknesses || []).map(
                  (weakness, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={weakness}
                        onChange={(e) =>
                          updateCompetitorArrayItem(
                            selectedCompetitorData.id,
                            'weaknesses',
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Enter a weakness..."
                        disabled={readOnly}
                      />
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeCompetitorArrayItem(
                              selectedCompetitorData.id,
                              'weaknesses',
                              index
                            )
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Key Features</Label>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      addCompetitorArrayItem(selectedCompetitorData.id, 'keyFeatures')
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {(selectedCompetitorData.keyFeatures || []).map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) =>
                        updateCompetitorArrayItem(
                          selectedCompetitorData.id,
                          'keyFeatures',
                          index,
                          e.target.value
                        )
                      }
                      placeholder="Enter a key feature..."
                      disabled={readOnly}
                    />
                    {!readOnly && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeCompetitorArrayItem(
                            selectedCompetitorData.id,
                            'keyFeatures',
                            index
                          )
                        }
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
      )}

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>
            What patterns do you see in the competitive landscape?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={analysisData.marketInsights || ''}
            onChange={(e) => updateField('marketInsights', e.target.value)}
            placeholder="Describe market trends, gaps, and insights..."
            rows={4}
            disabled={readOnly}
          />
        </CardContent>
      </Card>

      {/* Opportunities & Threats */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Opportunities</CardTitle>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const opportunities = analysisData.opportunities || [];
                    updateField('opportunities', [...opportunities, '']);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(analysisData.opportunities || []).map((opp, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={opp}
                  onChange={(e) => {
                    const opportunities = [...(analysisData.opportunities || [])];
                    opportunities[index] = e.target.value;
                    updateField('opportunities', opportunities);
                  }}
                  placeholder="Enter an opportunity..."
                  disabled={readOnly}
                  className="bg-white dark:bg-gray-950"
                />
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const opportunities = (analysisData.opportunities || []).filter(
                        (_, i) => i !== index
                      );
                      updateField('opportunities', opportunities);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Threats</CardTitle>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const threats = analysisData.threats || [];
                    updateField('threats', [...threats, '']);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(analysisData.threats || []).map((threat, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={threat}
                  onChange={(e) => {
                    const threats = [...(analysisData.threats || [])];
                    threats[index] = e.target.value;
                    updateField('threats', threats);
                  }}
                  placeholder="Enter a threat..."
                  disabled={readOnly}
                  className="bg-white dark:bg-gray-950"
                />
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const threats = (analysisData.threats || []).filter(
                        (_, i) => i !== index
                      );
                      updateField('threats', threats);
                    }}
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
