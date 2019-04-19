import { FluxAction } from './FluxAction';
import { FluxModuleOption } from './FluxModuleOption';

export class FluxModule extends FluxModuleOption {
  public Actions?: FluxAction[];

  public Deleted: boolean;

  public Left: number;

  public Top: number;

  public Settings: any;

  public Status: any;

  public Text: string;

  public Token: string;
}
