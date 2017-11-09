import { SeriesEdition } from '../series-edition';
export class Series {
    constructor(
        public id?: number,
        public name?: string,
        public shortname?: string,
        public organizer?: string,
        public logo?: any,
        public logoContentType?: any,
        public logoUrl?: string,
        public editions?: SeriesEdition,
    ) { }
}
