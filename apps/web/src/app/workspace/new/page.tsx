'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Rocket, BookOpen, Lightbulb, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { projectsAPI } from '@/lib/api/projects';

const STACKS = [
  {
    id: 'yc-startup',
    name: 'YC Startup',
    description: 'Launch a startup with the Y Combinator methodology',
    icon: Rocket,
    color: 'text-orange-500',
  },
  {
    id: 'book-author',
    name: 'Book Author',
    description: 'Write and structure your book from idea to manuscript',
    icon: BookOpen,
    color: 'text-blue-500',
  },
  {
    id: 'custom',
    name: 'Custom Project',
    description: 'Start with a blank canvas and build your own stack',
    icon: Lightbulb,
    color: 'text-purple-500',
  },
];

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedStack = searchParams.get('stack');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStack, setSelectedStack] = useState(preselectedStack || 'yc-startup');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setIsCreating(true);

    try {
      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // TODO: Get actual workspace and user IDs from auth context
      const project = await projectsAPI.create({
        name,
        slug,
        description,
        stack: selectedStack === 'custom' ? undefined : selectedStack,
        workspaceId: 'demo-workspace-id', // Replace with actual workspace ID
        creatorId: 'demo-user-id', // Replace with actual user ID
      });

      // Redirect to the new project
      router.push(`/workspace/projects/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/workspace">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Workspace
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
          <p className="text-muted-foreground">
            Choose a stack to get started with proven frameworks and structures
          </p>
        </div>

        {/* Stack Selection */}
        <div className="mb-8">
          <Label className="mb-4 block text-base">Choose Your Stack</Label>
          <div className="grid gap-4 md:grid-cols-3">
            {STACKS.map((stack) => {
              const Icon = stack.icon;
              return (
                <Card
                  key={stack.id}
                  className={`cursor-pointer transition-all ${
                    selectedStack === stack.id
                      ? 'border-primary shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedStack(stack.id)}
                >
                  <CardContent className="p-6">
                    <Icon className={`h-8 w-8 mb-3 ${stack.color}`} />
                    <h3 className="font-semibold mb-2">{stack.name}</h3>
                    <p className="text-sm text-muted-foreground">{stack.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Give your project a name and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="My Awesome Startup"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="A brief description of your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                className="flex-1"
                onClick={handleCreate}
                disabled={!name.trim() || isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Project'}
              </Button>
              <Link href="/workspace">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
