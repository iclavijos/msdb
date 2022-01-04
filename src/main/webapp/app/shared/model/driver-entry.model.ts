import { IDriver } from './driver.model';

export interface IDriverEntry {
  driver?: IDriver;
  rookie?: boolean;
  category?: number;
}

export class DriverEntry implements IDriverEntry {
  constructor(public driver?: IDriver, public rookie?: boolean, public category?: number) {}
}
