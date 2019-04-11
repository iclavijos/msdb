import { ISeriesEdition } from 'app/shared/model/series-edition.model';

export interface ISeries {
    id?: number;
    name?: string;
    shortname?: string;
    organizer?: string;
    logoContentType?: string;
    logo?: any;
    editions?: ISeriesEdition[];
}

export class Series implements ISeries {
    constructor(
        public id?: number,
        public name?: string,
        public shortname?: string,
        public organizer?: string,
        public logoContentType?: string,
        public logo?: any,
        public editions?: ISeriesEdition[]
    ) {}
}
