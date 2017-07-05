import { BaseEntity } from './../../shared';

export class Engine implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public manufacturer?: string,
        public capacity?: number,
        public architecture?: string,
        public debutYear?: number,
        public petrolEngine?: boolean,
        public dieselEngine?: boolean,
        public electricEngine?: boolean,
        public turbo?: boolean,
        public imageContentType?: string,
        public image?: any,
        public evolutions?: BaseEntity[],
        public derivedFrom?: BaseEntity,
    ) {
        this.petrolEngine = false;
        this.dieselEngine = false;
        this.electricEngine = false;
        this.turbo = false;
    }
}
