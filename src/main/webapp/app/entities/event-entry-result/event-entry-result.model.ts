export class EventEntryResult {
    constructor(
        public id?: number,
        public finalPosition?: number,
        public totalTime?: number,
        public bestLapTime?: number,
        public lapsCompleted?: number,
        public retired?: boolean,
    ) { }
}
