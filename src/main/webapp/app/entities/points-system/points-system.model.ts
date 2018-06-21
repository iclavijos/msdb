import { BaseEntity } from './../../shared';

export class PointsSystem implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public points?: string,
        public pointsMostLeadLaps?: number,
        public pointsFastLap?: number,
        public pointsPole?: number,
        public pointsLeadLap?: number,
    ) {
    }
}
