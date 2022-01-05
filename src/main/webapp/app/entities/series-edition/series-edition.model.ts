import { ICategory } from 'app/entities/category/category.model';
import { ISeries } from 'app/entities/series/series.model';

export interface ISeriesEdition {
  id?: number;
  period?: string;
  singleChassis?: boolean;
  singleEngine?: boolean;
  singleTyre?: boolean;
  allowedCategories?: ICategory | null;
  series?: ISeries | null;
}

export class SeriesEdition implements ISeriesEdition {
  constructor(
    public id?: number,
    public period?: string,
    public singleChassis?: boolean,
    public singleEngine?: boolean,
    public singleTyre?: boolean,
    public allowedCategories?: ICategory | null,
    public series?: ISeries | null
  ) {
    this.singleChassis = this.singleChassis ?? false;
    this.singleEngine = this.singleEngine ?? false;
    this.singleTyre = this.singleTyre ?? false;
  }
}

export function getSeriesEditionIdentifier(seriesEdition: ISeriesEdition): number | undefined {
  return seriesEdition.id;
}
