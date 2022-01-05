import { IRacetrack } from 'app/entities/racetrack/racetrack.model';

export interface IRacetrackLayout {
  id?: number;
  name?: string;
  length?: number;
  yearFirstUse?: number;
  layoutImageContentType?: string | null;
  layoutImage?: string | null;
  active?: boolean | null;
  racetrack?: IRacetrack | null;
}

export class RacetrackLayout implements IRacetrackLayout {
  constructor(
    public id?: number,
    public name?: string,
    public length?: number,
    public yearFirstUse?: number,
    public layoutImageContentType?: string | null,
    public layoutImage?: string | null,
    public active?: boolean | null,
    public racetrack?: IRacetrack | null
  ) {
    this.active = this.active ?? false;
  }
}

export function getRacetrackLayoutIdentifier(racetrackLayout: IRacetrackLayout): number | undefined {
  return racetrackLayout.id;
}
