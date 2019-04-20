import { IChassis } from 'app/shared/model/chassis.model';

export interface IChassis {
    id?: number;
    name?: string;
    manufacturer?: string;
    debutYear?: number;
    evolutions?: IChassis[];
    derivedFrom?: IChassis;
}

export class Chassis implements IChassis {
    constructor(
        public id?: number,
        public name?: string,
        public manufacturer?: string,
        public debutYear?: number,
        public evolutions?: IChassis[],
        public derivedFrom?: IChassis
    ) {}
}
