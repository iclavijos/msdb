import { IRacetrack } from 'app/shared/model/racetrack.model';

export interface IRacetrackLayout {
    id?: number;
    name?: string;
    length?: number;
    yearFirstUse?: number;
    layoutImageContentType?: string;
    layoutImage?: any;
    active?: boolean;
    racetrack?: IRacetrack;
}

export class RacetrackLayout implements IRacetrackLayout {
    constructor(
        public id?: number,
        public name?: string,
        public length?: number,
        public yearFirstUse?: number,
        public layoutImageContentType?: string,
        public layoutImage?: any,
        public active?: boolean,
        public racetrack?: IRacetrack
    ) {
        this.active = this.active || false;
    }
}
