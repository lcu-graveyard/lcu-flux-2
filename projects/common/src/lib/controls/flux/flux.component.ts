import { Component, EventEmitter, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FluxAction } from '../../models/FluxAction';
import { FluxActionEvent } from '../../models/FluxActionEvent';
import { FluxConfig } from '../../models/FluxConfig';
import { FluxModule } from '../../models/FluxModule';
import { MatDrawer } from '@angular/material';
import { FluxSurfaceComponent } from '../flux-surface/flux-surface.component';
import { jsPlumbToolkitComponent } from '../../jsplumb/toolkit/toolkit.component';
import { FluxLayout } from '../../models/FluxLayout';

@Component({
  selector: 'lcu-flux',
  templateUrl: './flux.component.html',
  styleUrls: ['./flux.component.scss']
})
export class FluxComponent implements OnInit {
  //  Fields

  //  Properties
  @Input('actions')
  public Actions: FluxAction[];

  @Output('action')
  public Action: EventEmitter<FluxActionEvent>;

  @Input('config')
  public Config: FluxConfig;

  @ViewChild(MatDrawer)
  public Drawer: MatDrawer;

  @Input('drawer-open')
  public DrawerOpen: boolean;

  public FluxLayout: FluxLayout;

  @Input('loading')
  public Loading: boolean;

  @Input('modules')
  public Modules: FluxModule[];

  @ViewChild(FluxSurfaceComponent)
  public Surface: FluxSurfaceComponent;

  @Input('toggle-action')
  public ToggleAction: FluxAction;

  //  Constructors
  constructor() {
    this.Action = new EventEmitter();

    this.DrawerOpen = true;

    this.Loading = false;

    this.ToggleAction = {
      Action: '$drawer',
      Icon: 'menu',
      Order: 0,
      Text: 'Toggle Drawer'
    };
  }

  //  Life Cycle
  public ngOnInit() {
  }

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
        Config: this.retrieveFluxConfig()
      });
    }
  }

  //  Helpers
  protected drawerAction() {
    this.Drawer.toggle();
  }

  protected retrieveFluxConfig(): FluxConfig {
    return <FluxConfig>{};
  }

  protected relayoutAction() {
    this.Surface.Relayout();
  }
}
