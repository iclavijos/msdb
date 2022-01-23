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
  evolutions?: IChassis[];
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
    public imageUrl?: string,
    public evolutions?: IChassis[]
  ) {}
}

export function getChassisIdentifier(chassis: IChassis): number | undefined {
  return chassis.id;
}
