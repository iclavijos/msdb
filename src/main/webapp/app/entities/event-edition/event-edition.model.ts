import { Category } from '../category';
import { RacetrackLayout } from '../racetrack-layout';
import { Event } from '../event';
export class EventEdition {
    constructor(
        public id?: number,
        public editionYear?: number,
        public shortEventName?: string,
        public longEventName?: string,
        public eventDate?: any,
        public allowedCategories?: Category[],
        public trackLayout?: RacetrackLayout,
        public event?: Event,
    ) { }
}
