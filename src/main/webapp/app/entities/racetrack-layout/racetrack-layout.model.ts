import { BaseEntity } from './../../shared';

export class RacetrackLayout implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public length?: number,
        public yearFirstUse?: number,
        public layoutImageContentType?: string,
        public layoutImage?: any,
        public active?: boolean,
        public racetrack?: BaseEntity,
    ) {
        this.active = false;
    }
}
