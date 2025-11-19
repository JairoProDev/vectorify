import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { ArtifactsModule } from './modules/artifacts/artifacts.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    WorkspacesModule,
    ProjectsModule,
    ArtifactsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
