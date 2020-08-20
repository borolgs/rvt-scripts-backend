import { MasterCodeEntity } from 'src/domains/entities/master-code.entity';

export interface LoadSavedMasterCodePort {
  loadMasterCode(): Promise<MasterCodeEntity>;
}
