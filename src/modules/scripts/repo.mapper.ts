import { CodeEntity } from 'src/domains/entities/code.entity';
import { MasterInfoEntity } from 'src/domains/entities/master-info.entity';

export class RepoMapper {
  static mapToCodeEntity(buffer: Buffer): CodeEntity {
    return new CodeEntity(buffer);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static mapToMasterInfoEntity(data: any): MasterInfoEntity {
    const { sha } = data;
    return new MasterInfoEntity(sha);
  }
}
