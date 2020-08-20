import { Sha } from 'src/domains/entities/master-info.entity';

export class GetCodeCommand {
  constructor(private readonly _sha: Sha) {}

  get sha(): Sha {
    return this._sha;
  }
}
