import { Moment } from 'moment';
import { IEventEntry } from 'app/shared/model/event-entry.model';

export interface IDriver {
    id?: number;
    name?: string;
    surname?: string;
    birthDate?: Moment;
    birthPlace?: string;
    deathDate?: Moment;
    deathPlace?: string;
    portraitContentType?: string;
    portrait?: any;
    participations?: IEventEntry[];
}

export class Driver implements IDriver {
    constructor(
        public id?: number,
        public name?: string,
        public surname?: string,
        public birthDate?: Moment,
        public birthPlace?: string,
        public deathDate?: Moment,
        public deathPlace?: string,
        public portraitContentType?: string,
        public portrait?: any,
        public participations?: IEventEntry[]
    ) {}
}
