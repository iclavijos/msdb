import { BaseEntity } from './../../shared';

export class EventEntry implements BaseEntity {
    constructor(
        public id?: number,
        public teamName?: string,
        public car?: BaseEntity,
        public driver?: BaseEntity,
        public participants?: BaseEntity[],
    ) {
    }
}
