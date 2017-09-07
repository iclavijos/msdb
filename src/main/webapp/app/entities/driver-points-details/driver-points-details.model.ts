import { BaseEntity } from './../../shared';

import { Driver } from '../driver/';
import { EventSession } from '../event-session/';

export class DriverPointsDetails implements BaseEntity {
    constructor(
        public id?: number,
        public driver?: Driver,
        public eventEditionId?: number,
        public session?: EventSession,
        public points?: number,
        public reason?: string
    ) {
    }
}
