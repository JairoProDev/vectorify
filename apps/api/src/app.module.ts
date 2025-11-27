import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { ArtifactsModule } from './modules/artifacts/artifacts.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { AIModule } from './modules/ai/ai.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ActivityModule } from './modules/activity/activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env', '../../.env'],
      expandVariables: true,
    }),
    DatabaseModule,
    WorkspacesModule,
    ProjectsModule,
    ArtifactsModule,
    TasksModule,
    AIModule,
    CommentsModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
