import { BaseEntity } from './../../shared';

export class Racetrack implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public location?: string,
        public logoContentType?: string,
        public logo?: any,
        public layouts?: BaseEntity[],
    ) {
    }
}
