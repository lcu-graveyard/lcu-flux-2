import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FluxAction } from '../../models/FluxAction';

@Component({
  selector: 'lcu-flux-action',
  templateUrl: './flux-action.component.html',
  styleUrls: ['./flux-action.component.scss']
})
export class FluxActionComponent implements OnInit {
  //  Properties
  @Input('action')
  public Action: FluxAction;

  @Output('on-action')
  public OnAction: EventEmitter<FluxAction>;

  //  Constructors
  constructor() {
    this.OnAction = new EventEmitter();
  }

  //  Life Cycle
  public ngOnInit() {}

  //  API Methods
  public EmitAction() {
    this.OnAction.emit(this.Action);
  }
}
