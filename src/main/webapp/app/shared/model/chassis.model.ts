import { IChassis } from 'app/shared/model/chassis.model';

export interface IChassis {
  id?: number;
  name?: string;
  manufacturer?: string;
  debutYear?: number;
  derivedFrom?: IChassis;
  rebranded?: boolean;
  image?: any;
  imageContentType?: any;
  imageUrl?: string;
}

export class Chassis implements IChassis {
  constructor(
    public id?: number,
    public name?: string,
    public manufacturer?: string,
    public debutYear?: number,
    public derivedFrom?: IChassis,
    public rebranded?: boolean,
    public image?: any,
    public imageContentType?: any,
    public imageUrl?: string
  ) {}
}
