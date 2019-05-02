import { Status } from '@lcu-ide/common';
import { FluxAction } from './FluxAction';

export class FluxModule {
  public Actions?: FluxAction[];

  public ControlType: string;

  public Height: number;

  public ID: string;

  public Left: number;

  public ModuleType: string;

  public Shape: string;

  public Status: Status;

  public Text: string;

  public Top: number;

  public Width: number;
}
