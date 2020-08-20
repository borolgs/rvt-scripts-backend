import { MasterInfoEntity } from 'src/domains/entities/master-info.entity';

export interface LoadMasterInfoPort {
  loadMasterInfo(): Promise<MasterInfoEntity>;
}
