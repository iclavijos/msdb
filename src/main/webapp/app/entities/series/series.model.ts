import { BaseEntity } from './../../shared';

export class Series implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public shortname?: string,
        public organizer?: string,
        public logoContentType?: string,
        public logo?: any,
        public editions?: BaseEntity[],
    ) {
    }
}
