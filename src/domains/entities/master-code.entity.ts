import { CodeEntity } from './code.entity';
import { MasterInfoEntity } from './master-info.entity';

export class MasterCodeEntity {
  constructor(private readonly _info: MasterInfoEntity, private readonly _code: CodeEntity) {}

  get info(): MasterInfoEntity {
    return this._info;
  }
  get code(): CodeEntity {
    return this._code;
  }

  static async fromRaw(info: MasterInfoEntity, raw: CodeEntity): Promise<MasterCodeEntity> {
    const newCode = await CodeEntity.filtered(raw);
    return new MasterCodeEntity(info, newCode);
  }

  isLast(info: MasterInfoEntity): boolean {
    return this._info.sha === info.sha;
  }
}
