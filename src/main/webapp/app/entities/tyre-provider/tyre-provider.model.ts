export interface ITyreProvider {
  id?: number;
  name?: string;
  logoContentType?: string | null;
  logo?: string | null;
  logoUrl?: string;
  letterColor?: string;
  backgroundColor?: string;
}

export class TyreProvider implements ITyreProvider {
  constructor(
    public id?: number,
    public name?: string,
    public logoContentType?: string | null,
    public logo?: string | null,
    public logoUrl?: any,
    public letterColor = '#000000',
    public backgroundColor = '#FFFFFF'
  ) {}
}

export function getTyreProviderIdentifier(tyreProvider: ITyreProvider): number | undefined {
  return tyreProvider.id;
}
