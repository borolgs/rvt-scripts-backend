import {
  Controller,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ScriptsService } from './scripts.service';
import { Request as Req } from 'express';

@Controller()
@UseGuards(JwtAuthGuard)
export class ScriptsController {
  constructor(private readonly scriptsService: ScriptsService) {}

  @Get('api/v1/scripts/*')
  @UseInterceptors(CacheInterceptor)
  async findAll(@Request() req: Req): Promise<any> {
    const path = req.path.split('api/v1/scripts/')[1];
    const data = await this.scriptsService.get(path);
    return data;
  }
}
