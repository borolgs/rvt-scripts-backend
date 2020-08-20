import { mock, when, instance, verify, spy } from 'ts-mockito';
import { LoadMasterInfoPort } from '../ports/out/load-master-info.port';
import { LoadSavedMasterCodePort } from '../ports/out/load-master-code.port';
import { LoadRawMasterCodePort } from '../ports/out/load-raw-master-code.port';
import { UpdateMasterCodePort } from '../ports/out/udpate-master-code.port';
import { MasterInfoEntity } from '../entities/master-info.entity';
import { RepoProxyService } from './repo-proxy.service';
import { GetCodeCommand } from '../ports/in/get-code.command';
import { MasterCodeEntity } from '../entities/master-code.entity';
import { CodeEntity } from '../entities/code.entity';

describe('RepoProxyService getCode', () => {
  let loadMasterInfoPort;
  let loadSavedMasterCodePort;
  let loadRawMasterCodePort;
  let updateMasterCodePort;

  beforeEach(() => {
    loadMasterInfoPort = mock<LoadMasterInfoPort>();
    loadSavedMasterCodePort = mock<LoadSavedMasterCodePort>();
    loadRawMasterCodePort = mock<LoadRawMasterCodePort>();
    updateMasterCodePort = mock<UpdateMasterCodePort>();
  });

  it('should return null if input sha == current sha', async () => {
    when(loadMasterInfoPort.loadMasterInfo()).thenReturn(Promise.resolve(new MasterInfoEntity('some_sha')));
    const repoProxyService = new RepoProxyService(
      instance(loadMasterInfoPort),
      instance(loadSavedMasterCodePort),
      instance(updateMasterCodePort),
      instance(loadRawMasterCodePort),
    );

    const result = await repoProxyService.getCode(new GetCodeCommand('some_sha'));
    expect(result).toBeNull();
  });

  it('should return MasterCode from cache', async () => {
    const masterInfo = new MasterInfoEntity('some_sha');
    when(loadMasterInfoPort.loadMasterInfo()).thenReturn(Promise.resolve(masterInfo));

    const mockedMasterCode = mock(MasterCodeEntity);
    when(mockedMasterCode.info).thenReturn(masterInfo);
    when(mockedMasterCode.isLast(masterInfo)).thenReturn(true);

    const masterCode = instance(mockedMasterCode);
    when(loadSavedMasterCodePort.loadMasterCode()).thenReturn(Promise.resolve(masterCode));

    const repoProxyService = new RepoProxyService(
      instance(loadMasterInfoPort),
      instance(loadSavedMasterCodePort),
      instance(updateMasterCodePort),
      instance(loadRawMasterCodePort),
    );

    const result = await repoProxyService.getCode(new GetCodeCommand('old_sha'));
    verify(loadRawMasterCodePort.loadRawMasterCode()).never();

    expect(result).toBe(masterCode);
  });

  it('should return MasterCode from github', async () => {
    const masterInfo = new MasterInfoEntity('some_sha');
    when(loadMasterInfoPort.loadMasterInfo()).thenReturn(Promise.resolve(masterInfo));

    when(loadSavedMasterCodePort.loadMasterCode()).thenReturn(Promise.resolve(null));

    jest.mock('../entities/code.entity');
    const mockStaticF = jest.fn();
    mockStaticF.mockReturnValue(Promise.resolve(instance(mock(CodeEntity))));
    CodeEntity.filtered = mockStaticF;

    const repoProxyService = new RepoProxyService(
      instance(loadMasterInfoPort),
      instance(loadSavedMasterCodePort),
      instance(updateMasterCodePort),
      instance(loadRawMasterCodePort),
    );

    const result = await repoProxyService.getCode(new GetCodeCommand('old_sha'));
    verify(loadRawMasterCodePort.loadRawMasterCode()).once();

    expect(result.info).toBe(masterInfo);
  });
});
