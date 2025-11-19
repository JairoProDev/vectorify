import { Plus, Rocket, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function WorkspacePage() {
  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Vectorify</h1>
        <p className="text-muted-foreground">
          Your Project Development Environment. Start building with proven frameworks and AI
          assistance.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/workspace/new?stack=yc-startup">
            <Card className="cursor-pointer transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  YC Startup
                </CardTitle>
                <CardDescription>
                  Launch a startup with the Y Combinator methodology
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/workspace/new?stack=book-author">
            <Card className="cursor-pointer transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Book Author
                </CardTitle>
                <CardDescription>
                  Write and structure your book from idea to manuscript
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/workspace/new?stack=custom">
            <Card className="cursor-pointer transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Custom Project
                </CardTitle>
                <CardDescription>Start with a blank canvas and build your own stack</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <Link href="/workspace/new">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No projects yet. Create your first project to get started!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
