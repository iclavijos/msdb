import { BaseEntity } from './../../shared';

export class TyreProvider implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public logoContentType?: string,
        public logo?: any,
    ) {
    }
}
