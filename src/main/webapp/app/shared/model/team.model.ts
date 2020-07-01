export interface ITeam {
  id?: number;
  name?: string;
  description?: string;
  hqLocation?: string;
  logoContentType?: string;
  logo?: any;
  logoUrl?: string;
}

export class Team implements ITeam {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public hqLocation?: string,
    public logo?: any,
    public logoContentType?: any,
    public logoUrl?: string
  ) {}
}
