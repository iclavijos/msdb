import { EventEdition } from '../event-edition/event-edition.model';

import { PointsSystem } from '../points-system';
import { DurationType, SessionType } from '../../shared';

export class EventSession {
    constructor(
        public id?: number,
        public name?: string,
        public shortname?: string,
        public sessionStartTime?: any,
        public originalStartTime?: any,
        public duration?: number,
        public maxDuration?: number,
        public durationType?: DurationType,
        public additionalLap = false,
        public sessionType?: SessionType,
        public sessionTypeValue?: number,
        public eventEdition?: EventEdition,
        public pointsSystemsSession?: any,
    ) { }
}
