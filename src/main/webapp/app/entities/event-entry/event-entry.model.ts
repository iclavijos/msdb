import { Driver } from '../driver';
import { Team } from '../team';
export class EventEntry {
    constructor(
        public id?: number,
        public teamName?: string,
        public driver?: Driver,
        public participants?: Team,
    ) { }
}
