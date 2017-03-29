export class Chassis {
    constructor(
        public id?: number,
        public name?: string,
        public manufacturer?: string,
        public debutYear?: number,
        public evolutions?: Chassis,
        public derivedFrom?: Chassis,
        public rebranded = false,
        public image?: any,
        public imageUrl?: string,
    ) { }
}
