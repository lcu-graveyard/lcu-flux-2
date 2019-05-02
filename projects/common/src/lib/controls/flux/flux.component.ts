import { Component, EventEmitter, OnInit, Input, Output, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FluxAction } from '../../models/FluxAction';
import { FluxActionEvent } from '../../models/FluxActionEvent';
import { FluxModule } from '../../models/FluxModule';
import { MatDrawer } from '@angular/material';
import { FluxSurfaceComponent } from '../flux-surface/flux-surface.component';
import { FluxLayout } from '../../models/FluxLayout';
import { FluxModuleOption } from '../../models/FluxModuleOption';
import { FluxStream } from '../../models/FluxStream';
import { FluxModulesValidation } from './../../models/FluxModulesValidation';
import { LCUjsPlumbService } from '../../svc/lcu-jsplumb.service';
import { FluxConfigManager } from '../../svc/flux-config-manager';

@Component({
  selector: 'lcu-flux',
  templateUrl: './flux.component.html',
  styleUrls: ['./flux.component.scss'],
  providers: [FluxConfigManager]
})
export class FluxComponent implements AfterViewInit, OnInit {
  //  Fields

  //  Properties
  @Input('actions')
  public Actions: FluxAction[];

  @Output('action')
  public Action: EventEmitter<FluxActionEvent>;

  @ViewChild(MatDrawer)
  public Drawer: MatDrawer;

  @Input('flux')
  public FluxID: string;

  public FluxLayout: FluxLayout;

  @Input('loading')
  public Loading: boolean;

  @Input('modules')
  public Modules: FluxModule[];

  @Input('modules-open')
  public ModulesOpen: boolean;

  @Input('options')
  public Options: FluxModuleOption[];

  @Input('streams')
  public Streams: FluxStream[];

  @ViewChild(FluxSurfaceComponent)
  public Surface: FluxSurfaceComponent;

  @Input('surface')
  public SurfaceID: string;

  @Input('toggle-action')
  public ToggleAction: FluxAction;

  @Input('validation')
  public Validation: FluxModulesValidation;

  //  Constructors
  constructor(protected jsplumb: LCUjsPlumbService, protected el: ElementRef) {
    this.Action = new EventEmitter();

    this.ModulesOpen = true;

    this.Loading = false;

    this.ToggleAction = {
      Action: '$drawer',
      Icon: { Icon: 'menu', IconSet: null },
      Order: 0,
      Text: 'Toggle Drawer'
    };
  }

  //  Life Cycle
  public ngAfterViewInit() {
    this.jsplumb.AddMiniview(this.SurfaceID, 'flux-miniview');
  }

  public ngOnInit() {}

  //  API Methods
  public EmitAction(action: FluxAction) {
    if (!action.Disabled) {
      switch (action.Action) {
        case '$drawer':
          this.drawerAction();
          break;

        case '$relayout':
          this.relayoutAction();
          break;
      }

      this.Action.emit({
        Action: action.Action,
        Output: this.Surface.Export()
      });
    }
  }

  //  Helpers
  protected drawerAction() {
    this.Drawer.toggle();
  }

  protected relayoutAction() {
    this.Surface.Relayout();
  }
}
