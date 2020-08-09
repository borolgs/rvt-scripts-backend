import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import fetch from 'node-fetch';
import { ConfigService } from '@nestjs/config';
import JSZip from 'jszip';
import path from 'path';

export type MasterInfo = {
  sha: string;
  message: string;
};

export type AllScripts = {
  buffer: Buffer;
};

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

  async getFullRepo(): Promise<AllScripts> {
    const buffer = await this.getMasterBuffer();
    const newBuffer = await this.createNewMasterBuffer(buffer);

    return {
      buffer: newBuffer,
    };
  }

  async getMasterInfo(): Promise<MasterInfo> {
    const response = await fetch(
      `https://api.github.com/repos/${this.userName}/${this.repo}/commits/master`,
      {
        method: 'get',
        headers: {
          Authorization: `token ${this.token}`,
        },
      },
    );

    if (response.status !== HttpStatus.OK) {
      throw new HttpException('Error', response.status);
    }

    const { sha, commit } = await response.json();

    const masterInfo = {
      sha,
      message: commit.message,
    };

    return masterInfo;
  }

  private async getMasterBuffer(): Promise<Buffer> {
    const response = await fetch(
      `https://api.github.com/repos/${this.userName}/${this.repo}/zipball/master`,
      {
        method: 'get',
        headers: {
          Authorization: `token ${this.token}`,
        },
      },
    );

    if (response.status !== HttpStatus.OK) {
      throw new HttpException('Error', response.status);
    }

    const buffer = await response.buffer();
    return buffer;
  }

  private async createNewMasterBuffer(buffer: Buffer): Promise<Buffer> {
    const zip = await JSZip.loadAsync(buffer);
    const files = zip.files;
    const filepaths = Object.keys(files);

    const newZip = new JSZip();

    for (const filepath of filepaths) {
      const allowedExts = ['.py', '.xaml'];
      const isAllowedFile =
        filepath.includes('src/scripts') &&
        allowedExts.includes(path.parse(filepath).ext);
      if (!isAllowedFile) continue;
      const zipObj = zip.file(filepath);
      const buffer = await zipObj.async('nodebuffer');

      newZip.file(filepath, buffer);
    }

    const newBuffer = await newZip.generateAsync({ type: 'nodebuffer' });

    return newBuffer;
  }
}
