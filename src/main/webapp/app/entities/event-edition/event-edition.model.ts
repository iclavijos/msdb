import { BaseEntity } from './../../shared';

export class EventEdition implements BaseEntity {
    constructor(
        public id?: number,
        public editionYear?: number,
        public shortEventName?: string,
        public longEventName?: string,
        public eventDate?: any,
        public allowedCategories?: BaseEntity,
        public trackLayout?: BaseEntity,
        public event?: BaseEntity,
    ) {
    }
}
