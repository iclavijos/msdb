import { RacetrackLayout } from '../racetrack-layout';
export class Racetrack {
    constructor(
        public id?: number,
        public name?: string,
        public location?: string,
        public logo?: any,
        public layouts?: RacetrackLayout,
    ) { }
}
