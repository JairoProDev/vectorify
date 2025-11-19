import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  getInfo() {
    return {
      name: 'Vectorify API',
      version: '1.0.0',
      description: 'Project Development Environment API',
      documentation: '/api/docs',
    };
  }
}
