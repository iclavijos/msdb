import { EventEdition } from '../event-edition';
export class Event {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public editions?: EventEdition[],
    ) { }
}
