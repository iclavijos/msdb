export class PointsSystem {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public points?: string,
        public pointsMostLeadLaps = 0,
        public pointsFastLap = 0,
        public maxPosFastLap = 0,
        public dnfFastLap = false,
        public pitlaneStartAllowed = false,
        public pctCompletedFastLap = 0,
        public pointsPole = 0,
        public pointsLeadLap = 0,
        public racePctCompleted = 0,
        public pctTotalPoints = 100,
        public active = true
    ) { }
}
