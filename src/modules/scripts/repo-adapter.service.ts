import { Injectable, HttpStatus, HttpException, Inject, CACHE_MANAGER } from '@nestjs/common';
import fetch from 'node-fetch';
import { ConfigService } from '@nestjs/config';
import { LoadRawMasterCodePort } from 'src/domains/ports/out/load-raw-master-code.port';
import { CodeEntity } from 'src/domains/entities/code.entity';
import { RepoMapper } from './repo.mapper';
import { LoadMasterInfoPort } from 'src/domains/ports/out/load-master-info.port';
import { MasterInfoEntity } from 'src/domains/entities/master-info.entity';
import { Cache } from 'cache-manager';
import { LoadSavedMasterCodePort } from 'src/domains/ports/out/load-master-code.port';
import { MasterCodeEntity } from 'src/domains/entities/master-code.entity';
import { UpdateMasterCodePort } from 'src/domains/ports/out/udpate-master-code.port';

@Injectable()
export class RepoAdapterService
  implements LoadRawMasterCodePort, LoadMasterInfoPort, LoadSavedMasterCodePort, UpdateMasterCodePort {
  private repo: string;
  private userName: string;
  private token: string;

  constructor(private configService: ConfigService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.repo = this.configService.get<string>('GITHUB_REPO');
    this.userName = this.configService.get<string>('GITHUB_USERNAME');
    this.token = this.configService.get<string>('GUTHUB_TOKEN');
  }

  async loadMasterInfo(): Promise<MasterInfoEntity> {
    let info: MasterInfoEntity = await this.cacheManager.get('sha');
    if (!info) {
      const data = await this.getMasterInfo();
      info = RepoMapper.mapToMasterInfoEntity(data);
      await this.cacheManager.set('sha', info, { ttl: 360 });
    }
    return info;
  }

  private async getMasterInfo(): Promise<any> {
    const response = await fetch(`https://api.github.com/repos/${this.userName}/${this.repo}/commits/master`, {
      method: 'get',
      headers: {
        Authorization: `token ${this.token}`,
      },
    });

    if (response.status !== HttpStatus.OK) {
      throw new HttpException('Error', response.status);
    }

    const data = await response.json();

    return data;
  }

  async loadRawMasterCode(): Promise<CodeEntity> {
    const buffer = await this.getMasterBuffer();
    return RepoMapper.mapToCodeEntity(buffer);
  }

  private async getMasterBuffer(): Promise<Buffer> {
    const response = await fetch(`https://api.github.com/repos/${this.userName}/${this.repo}/zipball/master`, {
      method: 'get',
      headers: {
        Authorization: `token ${this.token}`,
      },
    });

    if (response.status !== HttpStatus.OK) {
      throw new HttpException('Error', response.status);
    }

    const buffer = await response.buffer();
    return buffer;
  }

  async loadMasterCode(): Promise<MasterCodeEntity> {
    const code = await this.cacheManager.get('master');
    // TODO: handle null
    return code;
  }

  updateMasterCode(code: MasterCodeEntity): void {
    this.cacheManager.set('master', code, { ttl: 60 * 60 * 24 });
  }
}
