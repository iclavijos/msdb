import { ISeriesEdition } from 'app/shared/model/series-edition.model';

export interface ISeries {
  id?: number;
  name?: string;
  shortname?: string;
  organizer?: string;
  logoContentType?: string;
  logo?: any;
  editions?: ISeriesEdition[];
  logoUrl?: string;
  relevance?: number;
}

export class Series implements ISeries {
  constructor(
    public id?: number,
    public name?: string,
    public shortname?: string,
    public organizer?: string,
    public logoContentType?: string,
    public logo?: any,
    public editions?: ISeriesEdition[],
    public logoUrl?: string,
    public relevance?: number
  ) {}
}

export function getSeriesIdentifier(series: ISeries): number | undefined {
  return series.id;
}
