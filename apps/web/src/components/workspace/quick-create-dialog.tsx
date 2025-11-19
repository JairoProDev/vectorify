'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  CheckSquare,
  Loader2,
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Eye,
  Zap,
} from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';

interface QuickCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ARTIFACT_TYPES = [
  {
    value: 'lean-canvas',
    label: 'Lean Canvas',
    icon: '📊',
    description: 'Business model canvas',
  },
  {
    value: 'bmc',
    label: 'Business Model Canvas',
    icon: '🎯',
    description: 'Full business model',
  },
  {
    value: 'user-persona',
    label: 'User Persona',
    icon: '👤',
    description: 'Target customer profile',
  },
  {
    value: 'competitor-analysis',
    label: 'Competitor Analysis',
    icon: '📈',
    description: 'Market competition review',
  },
  {
    value: 'vision-mission',
    label: 'Vision & Mission',
    icon: '🎯',
    description: 'Company direction',
  },
  {
    value: 'swot',
    label: 'SWOT Analysis',
    icon: '⚖️',
    description: 'Strengths & weaknesses',
  },
  {
    value: 'roadmap',
    label: 'Product Roadmap',
    icon: '🗺️',
    description: 'Product timeline',
  },
];

const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-gray-500' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
];

export function QuickCreateDialog({ open, onOpenChange }: QuickCreateDialogProps) {
  const router = useRouter();
  const { currentProject, user, addNotification } = useWorkspaceStore();

  // Artifact state
  const [artifactName, setArtifactName] = useState('');
  const [artifactType, setArtifactType] = useState('lean-canvas');
  const [artifactIcon, setArtifactIcon] = useState('📊');

  // Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('');

  const [creating, setCreating] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const resetForm = () => {
    setArtifactName('');
    setArtifactType('lean-canvas');
    setArtifactIcon('📊');
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskDueDate('');
    setUseAI(false);
  };

  const handleCreateArtifact = async () => {
    if (!artifactName.trim() || !currentProject?.id) return;

    setCreating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/artifacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: artifactName,
          type: artifactType,
          icon: artifactIcon,
          content: {},
          projectId: currentProject.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create artifact');

      const artifact = await response.json();

      addNotification({
        type: 'success',
        title: 'Artifact Created',
        message: `${artifactName} has been created successfully`,
      });

      onOpenChange(false);
      resetForm();

      // Navigate to the new artifact
      router.push(`/workspace/projects/${currentProject.id}/artifacts/${artifact.id}`);
    } catch (error) {
      console.error('Failed to create artifact:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to create artifact',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !currentProject?.id || !user?.id) return;

    setCreating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          status: 'todo',
          dueDate: taskDueDate || undefined,
          projectId: currentProject.id,
          creatorId: user.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');

      const task = await response.json();

      addNotification({
        type: 'success',
        title: 'Task Created',
        message: `${taskTitle} has been created successfully`,
      });

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create task:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to create task',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleAIGenerate = async (type: 'artifact' | 'task') => {
    setUseAI(true);
    // In a real implementation, this would call the AI to generate content
    addNotification({
      type: 'info',
      title: 'AI Generation',
      message: 'AI content generation coming soon!',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Quick Create</DialogTitle>
          <DialogDescription>
            Quickly create artifacts or tasks for your project
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="artifact" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="artifact">
              <FileText className="h-4 w-4 mr-2" />
              Artifact
            </TabsTrigger>
            <TabsTrigger value="task">
              <CheckSquare className="h-4 w-4 mr-2" />
              Task
            </TabsTrigger>
          </TabsList>

          {/* Create Artifact */}
          <TabsContent value="artifact" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="artifact-name">Artifact Name</Label>
              <Input
                id="artifact-name"
                placeholder="e.g., My Lean Canvas"
                value={artifactName}
                onChange={(e) => setArtifactName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && artifactName.trim()) {
                    handleCreateArtifact();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artifact-type">Artifact Type</Label>
              <Select
                value={artifactType}
                onValueChange={(value) => {
                  setArtifactType(value);
                  const type = ARTIFACT_TYPES.find((t) => t.value === value);
                  if (type) setArtifactIcon(type.icon);
                }}
              >
                <SelectTrigger id="artifact-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ARTIFACT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="artifact-icon">Icon</Label>
              <Input
                id="artifact-icon"
                placeholder="📊"
                value={artifactIcon}
                onChange={(e) => setArtifactIcon(e.target.value)}
                maxLength={2}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateArtifact}
                disabled={!artifactName.trim() || creating || !currentProject}
                className="flex-1"
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Create Artifact
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAIGenerate('artifact')}
                disabled={creating}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Create Task */}
          <TabsContent value="task" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="e.g., Complete market research"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && taskTitle.trim()) {
                    handleCreateTask();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">Description (Optional)</Label>
              <Textarea
                id="task-description"
                placeholder="Add details about this task..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={taskPriority} onValueChange={setTaskPriority}>
                  <SelectTrigger id="task-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_PRIORITIES.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${priority.color}`} />
                          <span>{priority.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-due-date">Due Date (Optional)</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateTask}
                disabled={!taskTitle.trim() || creating || !currentProject || !user}
                className="flex-1"
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Create Task
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAIGenerate('task')}
                disabled={creating}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
