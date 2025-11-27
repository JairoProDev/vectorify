'use client';

import { Plus, Rocket, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useI18n } from '@/i18n/hooks';

export default function WorkspacePage() {
  const { t } = useI18n();

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('common.welcome')}</h1>
        <p className="text-muted-foreground">
          {t('common.description')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('workspace.quickStart')}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/workspace/new?stack=yc-startup">
            <Card className="cursor-pointer transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  {t('project.ycStartup')}
                </CardTitle>
                <CardDescription>
                  {t('project.ycStartupDesc')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/workspace/new?stack=book-author">
            <Card className="cursor-pointer transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {t('project.bookAuthor')}
                </CardTitle>
                <CardDescription>
                  {t('project.bookAuthorDesc')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/workspace/new?stack=custom">
            <Card className="cursor-pointer transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  {t('project.customProject')}
                </CardTitle>
                <CardDescription>{t('project.customProjectDesc')}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('workspace.recentProjects')}</h2>
          <Link href="/workspace/new">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              {t('workspace.newProject')}
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {t('workspace.noProjects')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
