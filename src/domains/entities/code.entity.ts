import JSZip from 'jszip';
import path from 'path';

export class CodeEntity {
  constructor(private readonly _buffer: Buffer) {}

  get buffer(): Buffer {
    return this._buffer;
  }

  static async filtered(old: CodeEntity): Promise<CodeEntity> {
    const zip = await JSZip.loadAsync(old.buffer);
    const files = zip.files;
    const filepaths = Object.keys(files);

    const newZip = new JSZip();

    for (const filepath of filepaths) {
      const allowedExts = ['.py', '.xaml'];
      const isAllowedFile = filepath.includes('src/scripts') && allowedExts.includes(path.parse(filepath).ext);
      if (!isAllowedFile) continue;
      const zipObj = zip.file(filepath);
      const buffer = await zipObj.async('nodebuffer');

      newZip.file(filepath, buffer);
    }

    const newBuffer = await newZip.generateAsync({ type: 'nodebuffer' });
    return new CodeEntity(newBuffer);
  }
}
