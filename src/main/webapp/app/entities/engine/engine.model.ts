export class Engine {
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
        public image?: any,
        public evolutions?: Engine,
        public derivedFrom?: Engine,
    ) { }
}
