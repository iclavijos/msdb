import { IRacetrackLayout } from 'app/entities/racetrack-layout/racetrack-layout.model';

export interface IRacetrack {
  id?: number;
  name?: string;
  location?: string;
  logoContentType?: string | null;
  logo?: string | null;
  layouts?: IRacetrackLayout[] | null;
}

export class Racetrack implements IRacetrack {
  constructor(
    public id?: number,
    public name?: string,
    public location?: string,
    public logoContentType?: string | null,
    public logo?: string | null,
    public layouts?: IRacetrackLayout[] | null
  ) {}
}

export function getRacetrackIdentifier(racetrack: IRacetrack): number | undefined {
  return racetrack.id;
}
