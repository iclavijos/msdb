export interface ICategory {
  id?: number;
  name?: string;
  shortname?: string;
  relevance?: number;
  categoryColor?: string;
  categoryFrontColor?: string;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public name?: string,
    public shortname?: string,
    public relevance?: number,
    public categoryColor = '#FFFFFF',
    public categoryFrontColor = '#000000'
  ) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
