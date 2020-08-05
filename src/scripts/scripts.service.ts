import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import fetch from 'node-fetch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScriptsService {
  private repo: string;
  private userName: string;
  private token: string;

  constructor(private configService: ConfigService) {
    this.repo = this.configService.get<string>('GITHUB_REPO');
    this.userName = this.configService.get<string>('GITHUB_USERNAME');
    this.token = this.configService.get<string>('GUTHUB_TOKEN');
  }

  async get(path: string): Promise<any> {
    const response = await fetch(
      `https://api.github.com/repos/${this.userName}/${this.repo}/contents/${path}`,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${this.token}`,
        },
      },
    );

    if (response.status !== HttpStatus.OK) {
      throw new HttpException('Error', response.status);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map(({ name, sha, path, type }) => ({
        type,
        name,
        sha,
        path,
      }));
    }

    const { name, content, sha } = data;
    const fileObj = {
      name,
      sha,
      content,
    };

    return fileObj;
  }
}
