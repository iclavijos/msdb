import { BaseEntity } from './../../shared';

export class Driver implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public surname?: string,
        public birthDate?: any,
        public birthPlace?: string,
        public nationality?: string,
        public deathDate?: any,
        public deathPlace?: string,
        public portrait?: any,
        public portraitUrl?: string
    ) { }

}
