import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, GitBranch, Brain, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Vectorify</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/workspace">
              <Button variant="ghost">Workspace</Button>
            </Link>
            <Link href="/workspace">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              The Future of Project Development
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              The IDE for Building
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Startups & Projects
              </span>
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              Vectorify is a Project Development Environment (PDE) that unifies strategy,
              execution, and AI assistance in one intelligent workspace.
            </p>
            <div className="flex gap-4">
              <Link href="/workspace">
                <Button size="lg" className="gap-2">
                  Start Building <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Why Vectorify is 10x Better
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<GitBranch />}
                title="Strategy-as-Code"
                description="Version control for your business strategy. Branch, merge, and time-travel through your project evolution."
              />
              <FeatureCard
                icon={<Brain />}
                title="AI Copilot"
                description="Vector understands your entire project context and acts as mentor, employee, and strategist."
              />
              <FeatureCard
                icon={<Zap />}
                title="Smart Stacks"
                description="Start with proven frameworks: YC Startup, Book Author, Research, and more. Created by experts."
              />
              <FeatureCard
                icon={<Users />}
                title="Real-time Multiplayer"
                description="Collaborate like in Figma. See your team's cursors, edits, and ideas in real-time."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Build Your Project?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join the future of project development. Start for free.
          </p>
          <Link href="/workspace">
            <Button size="lg" className="gap-2">
              Create Your First Project <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 Vectorify. Built with 💙 for founders and creators.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
