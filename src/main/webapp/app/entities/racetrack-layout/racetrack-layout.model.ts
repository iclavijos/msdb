import { IRacetrack } from '../racetrack/racetrack.model';

export interface IRacetrackLayout {
  id?: number;
  name?: string;
  length?: number;
  yearFirstUse?: number;
  layoutImageContentType?: string;
  layoutImage?: any;
  layoutImageUrl?: string;
  active?: boolean;
  racetrack?: IRacetrack;
}

export class RacetrackLayout implements IRacetrackLayout {
  constructor(
    public racetrack?: IRacetrack,
    public id?: number,
    public name?: string,
    public length?: number,
    public yearFirstUse?: number,
    public layoutImageContentType?: string,
    public layoutImage?: any,
    public layoutImageUrl?: string,
    public active?: boolean
  ) {
    this.racetrack = racetrack;
    this.active = this.active ?? false;
  }
}

export function getRacetrackLayoutIdentifier(racetrackLayout: IRacetrackLayout): number | undefined {
  return racetrackLayout.id;
}

export function getFullName(racetrackLayout: IRacetrackLayout): string {
  return `${racetrackLayout.racetrack!.name} - ${racetrackLayout.name}`;
}
