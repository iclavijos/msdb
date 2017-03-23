import { Racetrack } from '../racetrack';
export class RacetrackLayout {
    constructor(
        public id?: number,
        public name?: string,
        public length?: number,
        public yearFirstUse?: number,
        public layoutImage?: any,
        public layoutImageUrl?: string,
        public active = true,
        public racetrack?: Racetrack,
    ) { }
}
