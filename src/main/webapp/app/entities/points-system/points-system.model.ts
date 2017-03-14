export class PointsSystem {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public points?: string,
        public pointsMostLeadLaps = 0,
        public pointsFastLap = 0,
        public pointsPole = 0,
        public pointsLeadLap = 0,
    ) { }
}
