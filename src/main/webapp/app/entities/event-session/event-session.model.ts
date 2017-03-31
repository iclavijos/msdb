import { EventEdition } from '../event-edition/event-edition.model';

import { DurationType, SessionType } from '../../shared';

export class EventSession {
    constructor(
        public id?: number,
        public name?: string,
        public shortname?: string,
        public sessionStartTime?: any,
        public duration?: number,
        public durationType?: DurationType,
        public additionalLap = false,
        public awardsPoints = false,
        public sessionType?: SessionType,
        public eventEdition?: EventEdition,
    ) { }
}
