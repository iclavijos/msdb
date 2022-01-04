export interface ILapData {
  lapNumber?: number;
  lapTime?: number;
}

export class LapData implements ILapData {
  constructor(public lapNumber?: number, public lapTime?: number) {}
}
