import { Engine } from '../engine';
import { Chassis } from '../chassis';
export class Car {
    constructor(
        public id?: number,
        public name?: string,
        public manufacturer?: string,
        public image?: any,
        public engine?: Engine,
        public chassis?: Chassis,
    ) { }
}
