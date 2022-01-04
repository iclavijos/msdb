export interface ICategory {
  id?: number;
  name?: string;
  shortname?: string;
  relevance?: number;
  logoContentType?: string | null;
  logo?: string | null;
  logoUrl?: string;
  categoryColor?: string;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public name?: string,
    public shortname?: string,
    public relevance?: number,
    public logoContentType?: string | null,
    public logo?: string | null,
    public logoUrl?: string,
    public categoryColor = '#FFFFFF'
  ) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
