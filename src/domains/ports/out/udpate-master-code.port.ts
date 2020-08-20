import { MasterCodeEntity } from 'src/domains/entities/master-code.entity';

export interface UpdateMasterCodePort {
  updateMasterCode(code: MasterCodeEntity);
}
