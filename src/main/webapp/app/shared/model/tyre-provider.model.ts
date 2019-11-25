export interface ITyreProvider {
  id?: number;
  name?: string;
  logoContentType?: string;
  logo?: any;
  letterColor?: string;
  backgroundColor?: string;
}

export class TyreProvider implements ITyreProvider {
  constructor(
    public id?: number,
    public name?: string,
    public logoContentType?: string,
    public logo?: any,
    public letterColor?: string,
    public backgroundColor?: string
  ) {}
}
