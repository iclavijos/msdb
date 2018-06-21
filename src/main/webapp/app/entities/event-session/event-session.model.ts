import { BaseEntity } from './../../shared';

export class EventSession implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public shortname?: string,
        public sessionStartTime?: any,
        public duration?: number,
    ) {
    }
}
