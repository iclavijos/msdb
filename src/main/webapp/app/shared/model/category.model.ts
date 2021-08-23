export interface ICategory {
  id?: number;
  name?: string;
  shortname?: string;
  relevance?: number;
  logoContentType?: string;
  logo?: any;
  logoUrl?: string;
  categoryColor?: string;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public name?: string,
    public shortname?: string,
    public relevance?: number,
    public logoContentType?: string,
    public logo?: any,
    public logoUrl?: string,
    public categoryColor = '#FFFFFF'
  ) {}
}
