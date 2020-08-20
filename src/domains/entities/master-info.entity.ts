export type Sha = string;

export class MasterInfoEntity {
  constructor(private readonly _sha: Sha) {}

  get sha(): Sha {
    return this._sha;
  }

  isLast(sha: Sha): boolean {
    return this._sha === sha;
  }
}
