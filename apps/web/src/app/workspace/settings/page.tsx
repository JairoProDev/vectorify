'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Trash2, Settings, Users, Bell, Shield, Database } from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';

export default function SettingsPage() {
  const { currentProject, addNotification } = useWorkspaceStore();

  // Project Settings
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStack, setProjectStack] = useState('');

  // Workspace Settings
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activityNotifications, setActivityNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);

  // AI Settings
  const [aiProvider, setAiProvider] = useState('openai');
  const [aiModel, setAiModel] = useState('gpt-4');
  const [aiApiKey, setAiApiKey] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name || '');
      setProjectDescription(currentProject.description || '');
      setProjectStack(currentProject.stack || '');
    }
  }, [currentProject]);

  const handleSaveProject = async () => {
    if (!currentProject?.id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${currentProject.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: projectName,
            description: projectDescription,
            stack: projectStack,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update project');

      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Project settings saved',
      });
    } catch (error) {
      console.error('Failed to save project:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save project settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!currentProject?.id) return;

    const confirmed = confirm(
      'Are you sure you want to delete this project? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${currentProject.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete project');

      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Project deleted',
      });

      window.location.href = '/workspace';
    } catch (error) {
      console.error('Failed to delete project:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete project',
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="project" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="project">
            <Settings className="h-4 w-4 mr-2" />
            Project
          </TabsTrigger>
          <TabsTrigger value="workspace">
            <Database className="h-4 w-4 mr-2" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Shield className="h-4 w-4 mr-2" />
            AI
          </TabsTrigger>
        </TabsList>

        {/* Project Settings */}
        <TabsContent value="project" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>
                Update your project's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Startup"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your project..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-stack">Stack</Label>
                <Input
                  id="project-stack"
                  value={projectStack}
                  onChange={(e) => setProjectStack(e.target.value)}
                  placeholder="YC Startup, Book Author, etc."
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Stack cannot be changed after project creation
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProject} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for this project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Delete Project</h4>
                  <p className="text-sm text-muted-foreground">
                    Once you delete a project, there is no going back.
                  </p>
                </div>
                <Button variant="destructive" onClick={handleDeleteProject}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workspace Settings */}
        <TabsContent value="workspace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Information</CardTitle>
              <CardDescription>
                Manage your workspace settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="My Workspace"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace-description">Description</Label>
                <Textarea
                  id="workspace-description"
                  value={workspaceDescription}
                  onChange={(e) => setWorkspaceDescription(e.target.value)}
                  placeholder="Describe your workspace..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your projects
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activity Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone makes changes
                  </p>
                </div>
                <Switch
                  checked={activityNotifications}
                  onCheckedChange={setActivityNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Comment Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone comments on your artifacts
                  </p>
                </div>
                <Switch
                  checked={commentNotifications}
                  onCheckedChange={setCommentNotifications}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Settings */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage who has access to this workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Team management coming soon</p>
                <p className="text-sm">
                  Invite collaborators and manage permissions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Configure your AI provider and models
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-provider">AI Provider</Label>
                <Input
                  id="ai-provider"
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                  placeholder="openai, anthropic, google, openrouter"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-model">Model</Label>
                <Input
                  id="ai-model"
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  placeholder="gpt-4, claude-3-opus, gemini-pro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-api-key">API Key (Optional)</Label>
                <Input
                  id="ai-api-key"
                  type="password"
                  value={aiApiKey}
                  onChange={(e) => setAiApiKey(e.target.value)}
                  placeholder="sk-..."
                />
                <p className="text-xs text-muted-foreground">
                  Use your own API key for unlimited requests
                </p>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
