import { ICategory } from 'app/shared/model/category.model';
import { ISeries } from 'app/shared/model/series.model';

export interface ISeriesEdition {
    id?: number;
    period?: string;
    singleChassis?: boolean;
    singleEngine?: boolean;
    singleTyre?: boolean;
    allowedCategories?: ICategory;
    series?: ISeries;
}

export class SeriesEdition implements ISeriesEdition {
    constructor(
        public id?: number,
        public period?: string,
        public singleChassis?: boolean,
        public singleEngine?: boolean,
        public singleTyre?: boolean,
        public allowedCategories?: ICategory,
        public series?: ISeries
    ) {
        this.singleChassis = this.singleChassis || false;
        this.singleEngine = this.singleEngine || false;
        this.singleTyre = this.singleTyre || false;
    }
}
