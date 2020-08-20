import { Controller, Get, UseGuards, Res, Inject, CACHE_MANAGER, Headers } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { Cache } from 'cache-manager';
import { Readable } from 'stream';
import { AppLogger } from '../logger/app-logger.service';
import { GetCodeUseCaseSymbol, GetCodeUseCase } from 'src/domains/ports/in/get-code.use-case';
import { GetCodeCommand } from 'src/domains/ports/in/get-code.command';
import { MasterCodeEntity } from 'src/domains/entities/master-code.entity';

@Controller()
@UseGuards(JwtAuthGuard)
export class ScriptsController {
  constructor(
    @Inject(GetCodeUseCaseSymbol)
    private readonly scriptsService: GetCodeUseCase,
    private readonly logger: AppLogger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('api/v1/scripts')
  async getAll(@Res() res: Response, @Headers('Scripts-Sha') userSha: string): Promise<any> {
    this.logger.log('Get all scripts');
    const command = new GetCodeCommand(userSha);
    const result = await this.scriptsService.getCode(command);

    if (!result) {
      return res.status(204).send();
    }

    return this.createResponse(res, result);
  }

  private async createResponse(res: Response, data: MasterCodeEntity) {
    const { code, info } = data;
    const stream = new Readable();
    stream.push(code.buffer);
    stream.push(null);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Length': code.buffer.length,
      'Scripts-Sha': info.sha,
    });
    return stream.pipe(res);
  }
}
