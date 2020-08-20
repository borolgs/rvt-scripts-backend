import { GetCodeCommand } from './get-code.command';
import { MasterCodeEntity } from 'src/domains/entities/master-code.entity';

export const GetCodeUseCaseSymbol = Symbol('GetCodeUseCaseSymbol');

export interface GetCodeUseCase {
  getCode(command: GetCodeCommand): Promise<MasterCodeEntity>;
}
