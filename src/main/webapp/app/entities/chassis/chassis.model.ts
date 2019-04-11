import { BaseEntity } from './../../shared';

export class Chassis implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public manufacturer?: string,
        public debutYear?: number,
        public evolutions?: BaseEntity[],
        public derivedFrom?: BaseEntity,
    ) {
    }
}
