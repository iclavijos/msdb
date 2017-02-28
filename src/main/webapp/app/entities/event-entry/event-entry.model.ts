import { Car } from '../car';
import { Driver } from '../driver';
import { Team } from '../team';
export class EventEntry {
    constructor(
        public id?: number,
        public teamName?: string,
        public car?: Car,
        public driver?: Driver,
        public participants?: Team,
    ) { }
}
