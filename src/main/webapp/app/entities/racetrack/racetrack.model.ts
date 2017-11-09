import { RacetrackLayout } from '../racetrack-layout';
export class Racetrack {
    constructor(
        public id?: number,
        public name?: string,
        public location?: string,
        public countryCode?: string,
        public timeZone?: string,
        public logo?: any,
        public logoContentType?: any,
        public logoUrl?: string,
        public layouts?: RacetrackLayout,
    ) { }
}
