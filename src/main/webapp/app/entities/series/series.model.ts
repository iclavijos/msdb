import { SeriesEdition } from '../series-edition';
export class Series {
    constructor(
        public id?: number,
        public name?: string,
        public shortname?: string,
        public organizer?: string,
        public logo?: any,
        public editions?: SeriesEdition,
    ) { }
}
