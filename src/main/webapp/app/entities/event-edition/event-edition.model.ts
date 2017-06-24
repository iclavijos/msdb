import { Driver } from '../driver';
import { Category } from '../category';
import { RacetrackLayout } from '../racetrack-layout';
import { Event } from '../event';
import { EventSession } from '../event-session';
import { SeriesEdition } from '../series-edition';

export class EventEdition {
    constructor(
        public id?: number,
        public previousEditionId?: number,
        public nextEditionId?: number,
        public editionYear?: number,
        public shortEventName?: string,
        public longEventName?: string,
        public eventDate?: any,
        public allowedCategories?: Category[],
        public trackLayout?: RacetrackLayout,
        public event?: Event,
        public sessions?: EventSession[],
        public multidriver?: boolean,
        public singleChassis?: boolean,
        public singleEngine?: boolean,
        public singleTyre?: boolean,
        public winners?: any,
        public seriesId?: number
    ) { }
}
