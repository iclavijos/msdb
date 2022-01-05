export interface IChassis {
  id?: number;
  name?: string;
  manufacturer?: string;
  debutYear?: number;
  evolutions?: IChassis[] | null;
  derivedFrom?: IChassis | null;
}

export class Chassis implements IChassis {
  constructor(
    public id?: number,
    public name?: string,
    public manufacturer?: string,
    public debutYear?: number,
    public evolutions?: IChassis[] | null,
    public derivedFrom?: IChassis | null
  ) {}
}

export function getChassisIdentifier(chassis: IChassis): number | undefined {
  return chassis.id;
}
