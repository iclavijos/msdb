import { BaseEntity } from './../../shared';

export class EventEntryResult implements BaseEntity {
    constructor(
        public id?: number,
        public finalPosition?: number,
        public totalTime?: number,
        public bestLapTime?: number,
        public lapsCompleted?: number,
        public retired?: boolean,
    ) {
        this.retired = false;
    }
}
