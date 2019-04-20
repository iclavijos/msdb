import { IEngine } from 'app/shared/model/engine.model';

export interface IEngine {
    id?: number;
    name?: string;
    manufacturer?: string;
    capacity?: number;
    architecture?: string;
    debutYear?: number;
    petrolEngine?: boolean;
    dieselEngine?: boolean;
    electricEngine?: boolean;
    turbo?: boolean;
    imageContentType?: string;
    image?: any;
    evolutions?: IEngine[];
    derivedFrom?: IEngine;
}

export class Engine implements IEngine {
    constructor(
        public id?: number,
        public name?: string,
        public manufacturer?: string,
        public capacity?: number,
        public architecture?: string,
        public debutYear?: number,
        public petrolEngine?: boolean,
        public dieselEngine?: boolean,
        public electricEngine?: boolean,
        public turbo?: boolean,
        public imageContentType?: string,
        public image?: any,
        public evolutions?: IEngine[],
        public derivedFrom?: IEngine
    ) {
        this.petrolEngine = this.petrolEngine || false;
        this.dieselEngine = this.dieselEngine || false;
        this.electricEngine = this.electricEngine || false;
        this.turbo = this.turbo || false;
    }
}
