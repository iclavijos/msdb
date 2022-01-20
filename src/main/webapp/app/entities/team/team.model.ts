export interface ITeam {
  id?: number;
  name?: string;
  description?: string | null;
  hqLocation?: string | null;
  logoContentType?: string | null;
  logo?: string | null;
  logoUrl?: string;
}

export class Team implements ITeam {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public hqLocation?: string | null,
    public logoContentType?: string | null,
    public logo?: string | null,
    public logoUrl?: string
  ) {}
}

export function getTeamIdentifier(team: ITeam): number | undefined {
  return team.id;
}
