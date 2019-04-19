import { Component, OnInit, Input } from '@angular/core';
import { FluxModuleOption } from '../../models/FluxModuleOption';

export enum FluxModulesBankViewTypes {
  Grid,
  List
}

@Component({
  selector: 'lcu-flux-modules-bank',
  templateUrl: './flux-modules-bank.component.html',
  styleUrls: ['./flux-modules-bank.component.scss']
})
export class FluxModulesBankComponent implements OnInit {
  //  Properties
  public get Categories(): string[] {
    return this.Options.map(opt => opt.Category).filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  @Input('options')
  public Options: FluxModuleOption[];

  @Input('view')
  public View: FluxModulesBankViewTypes;

  public ViewTypes = FluxModulesBankViewTypes;

  //  Constructors
  constructor() {
    this.View = FluxModulesBankViewTypes.List;
  }

  //  Life Cycle
  public ngOnInit() {}

  //  API Methods
  public GetOptions(category: string) {
    return this.Options.filter(opt => opt.Category === category);
  }
}
