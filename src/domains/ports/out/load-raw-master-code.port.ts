import { CodeEntity } from 'src/domains/entities/code.entity';

export interface LoadRawMasterCodePort {
  loadRawMasterCode(): Promise<CodeEntity>;
}
