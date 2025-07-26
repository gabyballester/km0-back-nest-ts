import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // Deployment automático test - Render
    return this.appService.getHello();
  }
}
// test
// Test comment for pre-commit
// Test comment for new strategy
