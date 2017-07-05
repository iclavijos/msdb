import { BaseEntity } from './../../shared';

export class Driver implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public surname?: string,
        public birthDate?: any,
        public birthPlace?: string,
        public deathDate?: any,
        public deathPlace?: string,
        public portraitContentType?: string,
        public portrait?: any,
        public participations?: BaseEntity[],
    ) {
    }
}
