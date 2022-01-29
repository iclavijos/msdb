import { IDriver } from 'app/entities/driver/driver.model';
import { ICategory } from 'app/entities/category/category.model';

export interface IDriverEntry {
  driver?: IDriver;
  rookie?: boolean;
  category?: ICategory;
}

export class DriverEntry implements IDriverEntry {
  constructor(public driver?: IDriver, public rookie?: boolean, public category?: ICategory) {}
}
