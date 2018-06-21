import { BaseEntity } from './../../shared';

export class SeriesEdition implements BaseEntity {
    constructor(
        public id?: number,
        public period?: string,
        public singleChassis?: boolean,
        public singleEngine?: boolean,
        public singleTyre?: boolean,
        public allowedCategories?: BaseEntity,
        public series?: BaseEntity,
    ) {
        this.singleChassis = false;
        this.singleEngine = false;
        this.singleTyre = false;
    }
}
