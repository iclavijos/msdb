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
        public durationType?: DurationType,
        public additionalLap = false,
        public pointsSystem?: PointsSystem,
        public psMultiplier?: number,
        public sessionType?: SessionType,
        public eventEdition?: EventEdition,
    ) { }
}
