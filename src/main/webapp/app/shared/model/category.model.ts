export interface ICategory {
  id?: number;
  name?: string;
  shortname?: string;
  logoContentType?: string;
  logo?: any;
  logoUrl?: string;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public name?: string,
    public shortname?: string,
    public logoContentType?: string,
    public logo?: any,
    public logoUrl?: string
  ) {}
}
