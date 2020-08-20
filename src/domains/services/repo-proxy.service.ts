import { GetCodeUseCase } from '../ports/in/get-code.use-case';
import { GetCodeCommand } from '../ports/in/get-code.command';
import { LoadMasterInfoPort } from '../ports/out/load-master-info.port';
import { LoadSavedMasterCodePort } from '../ports/out/load-master-code.port';
import { UpdateMasterCodePort } from '../ports/out/udpate-master-code.port';
import { LoadRawMasterCodePort } from '../ports/out/load-raw-master-code.port';
import { MasterCodeEntity } from '../entities/master-code.entity';

export class RepoProxyService implements GetCodeUseCase {
  constructor(
    private readonly _loadMasterInfoPort: LoadMasterInfoPort,
    private readonly _loadSavedMasterCodePort: LoadSavedMasterCodePort,
    private readonly _updateMasterCodePort: UpdateMasterCodePort,
    private readonly _loadRawMasterCodePort: LoadRawMasterCodePort,
  ) {}

  async getCode(command: GetCodeCommand): Promise<MasterCodeEntity> {
    const info = await this._loadMasterInfoPort.loadMasterInfo();

    if (info.isLast(command.sha)) {
      return null;
    }

    let code = await this._loadSavedMasterCodePort.loadMasterCode();

    if (code && code.isLast(info)) {
      return code;
    }

    const rawCode = await this._loadRawMasterCodePort.loadRawMasterCode();
    code = await MasterCodeEntity.fromRaw(info, rawCode);

    this._updateMasterCodePort.updateMasterCode(code);

    return code;
  }
}
