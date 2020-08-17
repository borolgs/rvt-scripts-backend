import {
  Controller,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
  CacheInterceptor,
  Res,
  Inject,
  CACHE_MANAGER,
  Headers,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ScriptsService, MasterInfo } from './scripts.service';
import { Request as Req, Response } from 'express';
import { Cache } from 'cache-manager';
import { Readable } from 'stream';
import { AppLogger } from 'src/logger/app-logger.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class ScriptsController {
  constructor(
    private readonly scriptsService: ScriptsService,
    private readonly logger: AppLogger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('api/v1/scripts/*')
  @UseInterceptors(CacheInterceptor)
  async findAll(@Request() req: Req): Promise<any> {
    const path = req.path.split('api/v1/scripts/')[1];
    const data = await this.scriptsService.get(path);
    return data;
  }

  @Get('api/v1/scripts')
  async getAll(
    @Res() res: Response,
    @Headers('Scripts-Sha') userSha: string,
  ): Promise<any> {
    this.logger.log('Get all scripts');
    let serverMasterInfo: MasterInfo = await this.cacheManager.get('sha');
    if (!serverMasterInfo) {
      const info = await this.scriptsService.getMasterInfo();
      await this.cacheManager.set('sha', info, { ttl: 360 });
      serverMasterInfo = info;
    }

    if (serverMasterInfo.sha === userSha) {
      return res.status(204).send();
    }

    const dataFromCache = await this.cacheManager.get('master');
    if (dataFromCache && dataFromCache.info.sha === serverMasterInfo.sha) {
      return this.createResponse(res, dataFromCache);
    }

    const { buffer } = await this.scriptsService.getFullRepo();
    const data = { buffer, info: serverMasterInfo };

    await this.cacheManager.set('master', data, { ttl: 60 * 60 * 24 });

    return this.createResponse(res, data);
  }

  private async createResponse(
    res: Response,
    data: { buffer: Buffer; info: MasterInfo },
  ) {
    const { buffer, info } = data;

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Length': buffer.length,
      'Scripts-Sha': info.sha,
    });
    return stream.pipe(res);
  }
}
