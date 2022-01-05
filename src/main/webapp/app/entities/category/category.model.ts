export interface ICategory {
  id?: number;
  name?: string;
  shortname?: string;
  logoContentType?: string | null;
  logo?: string | null;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public name?: string,
    public shortname?: string,
    public logoContentType?: string | null,
    public logo?: string | null
  ) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
