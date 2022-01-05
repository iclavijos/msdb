export interface IEngine {
  id?: number;
  name?: string;
  manufacturer?: string;
  capacity?: number;
  architecture?: string;
  debutYear?: number;
  petrolEngine?: boolean | null;
  dieselEngine?: boolean | null;
  electricEngine?: boolean | null;
  turbo?: boolean | null;
  imageContentType?: string | null;
  image?: string | null;
  evolutions?: IEngine[] | null;
  derivedFrom?: IEngine | null;
}

export class Engine implements IEngine {
  constructor(
    public id?: number,
    public name?: string,
    public manufacturer?: string,
    public capacity?: number,
    public architecture?: string,
    public debutYear?: number,
    public petrolEngine?: boolean | null,
    public dieselEngine?: boolean | null,
    public electricEngine?: boolean | null,
    public turbo?: boolean | null,
    public imageContentType?: string | null,
    public image?: string | null,
    public evolutions?: IEngine[] | null,
    public derivedFrom?: IEngine | null
  ) {
    this.petrolEngine = this.petrolEngine ?? false;
    this.dieselEngine = this.dieselEngine ?? false;
    this.electricEngine = this.electricEngine ?? false;
    this.turbo = this.turbo ?? false;
  }
}

export function getEngineIdentifier(engine: IEngine): number | undefined {
  return engine.id;
}
