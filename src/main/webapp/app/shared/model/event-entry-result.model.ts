export interface IEventEntryResult {
    id?: number;
    finalPosition?: number;
    totalTime?: number;
    bestLapTime?: number;
    lapsCompleted?: number;
    retired?: boolean;
}

export class EventEntryResult implements IEventEntryResult {
    constructor(
        public id?: number,
        public finalPosition?: number,
        public totalTime?: number,
        public bestLapTime?: number,
        public lapsCompleted?: number,
        public retired?: boolean
    ) {
        this.retired = this.retired || false;
    }
}
