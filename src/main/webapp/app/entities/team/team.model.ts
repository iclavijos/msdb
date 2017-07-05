import { BaseEntity } from './../../shared';

export class Team implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public hqLocation?: string,
        public logoContentType?: string,
        public logo?: any,
        public participations?: BaseEntity[],
    ) {
    }
}
