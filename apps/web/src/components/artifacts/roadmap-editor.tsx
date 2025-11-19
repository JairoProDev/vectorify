'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Sparkles, Plus, Trash2 } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'blocked';
  assignee?: string;
}

interface RoadmapData {
  milestones?: Milestone[];
}

interface RoadmapEditorProps {
  data?: RoadmapData;
  onSave?: (data: RoadmapData) => void;
  readOnly?: boolean;
}

export function RoadmapEditor({ data, onSave, readOnly = false }: RoadmapEditorProps) {
  const [roadmapData, setRoadmapData] = useState<RoadmapData>(
    data || { milestones: [] }
  );
  const [hasChanges, setHasChanges] = useState(false);

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: 'planned',
    };

    setRoadmapData((prev) => ({
      ...prev,
      milestones: [...(prev.milestones || []), newMilestone],
    }));
    setHasChanges(true);
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setRoadmapData((prev) => ({
      ...prev,
      milestones: prev.milestones?.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }));
    setHasChanges(true);
  };

  const removeMilestone = (id: string) => {
    setRoadmapData((prev) => ({
      ...prev,
      milestones: prev.milestones?.filter((m) => m.id !== id),
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(roadmapData);
      setHasChanges(false);
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'blocked':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Roadmap</h2>
          <p className="text-sm text-muted-foreground">
            Plan and track your product milestones
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

      {/* Timeline View */}
      <div className="space-y-4">
        {roadmapData.milestones?.map((milestone, index) => (
          <Card key={milestone.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(milestone.status)}`} />
                  {readOnly ? (
                    <div>
                      <h3 className="font-semibold">{milestone.title || 'Untitled Milestone'}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  ) : (
                    <div className="flex-1 space-y-2">
                      <Input
                        value={milestone.title}
                        onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                        placeholder="Milestone title"
                        className="font-semibold"
                      />
                      <Input
                        value={milestone.description}
                        onChange={(e) =>
                          updateMilestone(milestone.id, { description: e.target.value })
                        }
                        placeholder="Description"
                      />
                    </div>
                  )}
                </div>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(milestone.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Start Date</Label>
                  {readOnly ? (
                    <p className="text-sm">{milestone.startDate}</p>
                  ) : (
                    <Input
                      type="date"
                      value={milestone.startDate}
                      onChange={(e) =>
                        updateMilestone(milestone.id, { startDate: e.target.value })
                      }
                    />
                  )}
                </div>
                <div>
                  <Label className="text-xs">End Date</Label>
                  {readOnly ? (
                    <p className="text-sm">{milestone.endDate}</p>
                  ) : (
                    <Input
                      type="date"
                      value={milestone.endDate}
                      onChange={(e) =>
                        updateMilestone(milestone.id, { endDate: e.target.value })
                      }
                    />
                  )}
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  {readOnly ? (
                    <p className="text-sm capitalize">{milestone.status.replace('-', ' ')}</p>
                  ) : (
                    <select
                      value={milestone.status}
                      onChange={(e) =>
                        updateMilestone(milestone.id, {
                          status: e.target.value as Milestone['status'],
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!readOnly && (
          <Button variant="outline" onClick={addMilestone} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Milestone
          </Button>
        )}

        {roadmapData.milestones?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No milestones yet. Create your first milestone to start planning your roadmap.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
