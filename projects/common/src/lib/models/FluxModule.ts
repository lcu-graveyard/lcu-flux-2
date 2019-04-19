import { FluxAction } from './FluxAction';
import { FluxModuleOption } from './FluxModuleOption';

export class FluxModule {
  public Actions?: FluxAction[];

  public ControlType: string;

  public Deleted: boolean;

  public Height: number;

  public ID: string;

  public Left: number;

  public ModuleType: string;

  public Shape: string;

  public Status: any;

  public Text: string;

  public Token: string;

  public Top: number;

  public Width: number;
}
