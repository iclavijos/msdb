import { IRacetrackLayout } from 'app/shared/model/racetrack-layout.model';

export interface IRacetrack {
    id?: number;
    name?: string;
    location?: string;
    logoContentType?: string;
    logo?: any;
    layouts?: IRacetrackLayout[];
}

export class Racetrack implements IRacetrack {
    constructor(
        public id?: number,
        public name?: string,
        public location?: string,
        public logoContentType?: string,
        public logo?: any,
        public layouts?: IRacetrackLayout[]
    ) {}
}
