import { Engine } from '../engine';
import { Chassis } from '../chassis';
import { TyreProvider } from '../tyre-provider';
import { FuelProvider } from '../fuel-provider';
export class Car {
    constructor(
        public id?: number,
        public name?: string,
        public manufacturer?: string,
        public image?: any,
        public engine?: Engine,
        public chassis?: Chassis,
        public tyreProvider?: TyreProvider,
        public fuelProvider?: FuelProvider,
    ) { }
}
