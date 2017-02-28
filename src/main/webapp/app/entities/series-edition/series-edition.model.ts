import { Category } from '../category';
import { Series } from '../series';
export class SeriesEdition {
    constructor(
        public id?: number,
        public period?: string,
        public singleChassis?: boolean,
        public singleEngine?: boolean,
        public singleTyre?: boolean,
        public allowedCategories?: Category,
        public series?: Series,
    ) { }
}
