export interface IEventEntryResult {
  id?: number;
  finalPosition?: number | null;
  totalTime?: number | null;
  bestLapTime?: number | null;
  lapsCompleted?: number | null;
  retired?: boolean | null;
}

export class EventEntryResult implements IEventEntryResult {
  constructor(
    public id?: number,
    public finalPosition?: number | null,
    public totalTime?: number | null,
    public bestLapTime?: number | null,
    public lapsCompleted?: number | null,
    public retired?: boolean | null
  ) {
    this.retired = this.retired ?? false;
  }
}

export function getEventEntryResultIdentifier(eventEntryResult: IEventEntryResult): number | undefined {
  return eventEntryResult.id;
}
