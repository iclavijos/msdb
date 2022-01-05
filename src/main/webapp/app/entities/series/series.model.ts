import { ISeriesEdition } from 'app/entities/series-edition/series-edition.model';

export interface ISeries {
  id?: number;
  name?: string;
  shortname?: string;
  organizer?: string | null;
  logoContentType?: string | null;
  logo?: string | null;
  editions?: ISeriesEdition[] | null;
}

export class Series implements ISeries {
  constructor(
    public id?: number,
    public name?: string,
    public shortname?: string,
    public organizer?: string | null,
    public logoContentType?: string | null,
    public logo?: string | null,
    public editions?: ISeriesEdition[] | null
  ) {}
}

export function getSeriesIdentifier(series: ISeries): number | undefined {
  return series.id;
}
