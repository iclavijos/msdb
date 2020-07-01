export interface ITyreProvider {
  id?: number;
  name?: string;
  logoContentType?: string;
  logo?: any;
  logoUrl?: string;
  letterColor?: string;
  backgroundColor?: string;
}

export class TyreProvider implements ITyreProvider {
  constructor(
    public id?: number,
    public name?: string,
    public logoContentType?: string,
    public logo?: any,
    public logoUrl?: any,
    public letterColor = '#000000',
    public backgroundColor = '#FFFFFF'
  ) {}
}
