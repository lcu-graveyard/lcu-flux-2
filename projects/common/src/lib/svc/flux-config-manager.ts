import { Injectable, EventEmitter } from '@angular/core';
import { FluxLayout } from '../models/FluxLayout';
import { Observable } from 'rxjs';
import { Status } from '@lcu-ide/common';

@Injectable()
export class FluxConfigManager {
  // 	Fields

  // 	Properties
  public CanvasClick: EventEmitter<Event>;

  public Connector: {
    Click: EventEmitter<any>;
    BeforeStart: (source: any, edgeType: string) => void;
    Before: (source: any, target: any, edgeData: any) => void;
    BeforeStartDetach: (source: any, target: any, edge: any) => void;
  };

  public CreateNode: EventEmitter<{ Type: string; Data: any; Callback: Function }>;

  public Edge: {
    Added: EventEmitter<any>;
    DoubleClick: EventEmitter<any>;
    Target: EventEmitter<{ Edge: any; Old: any; New: any }>;
  };

  public ModeChanged: EventEmitter<string>;

  public Repainted: EventEmitter<Status>;

  public ToggleSelection: EventEmitter<any>;

  // 	Constructors
  constructor() {
    this.CanvasClick = new EventEmitter();

    this.Connector = {
      Click: new EventEmitter(),
      BeforeStart: null,
      Before: null,
      BeforeStartDetach: null
    };

    this.CreateNode = new EventEmitter();

    this.Edge = {
      Added: new EventEmitter(),
      DoubleClick: new EventEmitter(),
      Target: new EventEmitter()
    };

    this.ModeChanged = new EventEmitter();

    this.Repainted = new EventEmitter();

    this.ToggleSelection = new EventEmitter();
  }

  // 	API Methods
  public Configure(layoutFlow: string): Observable<FluxLayout> {
    return Observable.create(obs => {
      obs.next(this.buildFluxLayout(layoutFlow));

      obs.complete();
    });
  }

  // 	Helpers
  protected buildFluxLayout(layoutFlow: string): FluxLayout {
    return {
      View: this.buildFluxLayoutView(),
      Palette: this.buildFluxLayoutPalette(),
      Renderer: this.buildFluxLayoutRenderer(layoutFlow),
      Toolkit: this.buildFluxLayoutToolkit()
    };
  }

  protected buildFluxLayoutView(): any {
    return {
      nodes: {
        selectable: {
          events: {
            tap: (params: any) => {
              this.ToggleSelection.emit(params);
            }
          }
        }
      },
      edges: {
        default: {
          anchor: 'AutoDefault',
          // anchor:["Continuous", { faces: ["Bottom", "Top"] }],
          endpoint: 'Blank',
          // cssClass: "common-edge",
          connector: ['Flowchart', { cornerRadius: 5 }],
          paintStyle: { strokeWidth: 2, stroke: '#f76258', outlineWidth: 3, outlineStroke: 'transparent' },
          hoverPaintStyle: { strokeWidth: 2, stroke: 'rgb(67,67,67)' }, // hover paint style for this edge type.
          events: {
            dblclick: (params: any) => {
              this.Edge.DoubleClick.emit(params);
            }
          },
          overlays: [['Arrow', { location: 1, width: 10, length: 10 }], ['Arrow', { location: 0.3, width: 10, length: 10 }]]
        },
        connection: {
          parent: 'default',
          overlays: [
            [
              'Label',
              {
                label: '${label}',
                events: {}
              }
            ]
          ]
        }
      },
      ports: {
        default: {
          paintStyle: { fill: '#f76258' }, // the endpoint's appearance
          hoverPaintStyle: { fill: '#434343' }, // appearance when mouse hovering on endpoint or connection,
          events: {
            click: (params: any) => {
              this.Connector.Click.emit(params);
            }
          }
        },
        source: {
          endpoint: 'Blank',
          edgeType: 'default',
          paintStyle: { fill: '#f76258' }, // the endpoint's appearance
          hoverPaintStyle: { fill: '#434343' },
          anchor: 'Right',
          maxConnections: -1,
          events: {
            click: (params: any) => {
              this.Connector.Click.emit(params);
            }
          },
          isSource: true,
          isTarget: false
        },
        target: {
          maxConnections: -1,
          endpoint: 'Blank',
          edgeType: 'default',
          anchor: 'Left',
          paintStyle: { fill: '#f76258' }, // the endpoint's appearance
          hoverPaintStyle: { fill: '#434343' },
          isSource: false,
          isTarget: true,
          events: {
            click: (params: any) => {
              this.Connector.Click.emit(params);
            }
          }
        }
      }
    };
  }

  protected buildFluxLayoutPalette(): any {
    return null;
  }

  protected buildFluxLayoutRenderer(layoutFlow: string): any {
    return {
      layout: {
        type: layoutFlow
      },
      events: {
        canvasClick: (e: Event) => {
          this.CanvasClick.emit(e);
        },
        objectRepainted: () => {
          this.Repainted.emit(<Status>{ Code: 0, Message: 'Success' });
        },
        edgeAdded: (params: any) => {
          this.Edge.Added.emit(params);
        },
        edgeTarget: (edge: any, oldTarget: any, newTarget: any) => {
          this.Edge.Target.emit({ Edge: edge, Old: oldTarget, New: newTarget });
        },
        modeChanged: (mode: string) => {
          this.ModeChanged.emit(mode);
        }
      },
      lassoInvert: false,
      elementsDroppable: true,
      consumeRightClick: false,
      dragOptions: {
        filter: '.jtk-draw-handle, .node-action, .node-action i',
        magnetize: false
      },
      modelLeftAttribute: 'Left',
      modelTopAttribute: 'Top'
    };
  }

  protected buildFluxLayoutToolkit(): any {
    return {
      beforeConnect: (source: any, target: any, edgeData: any) => {
        if (this.Connector.Before) {
          return this.Connector.Before(source, target, edgeData);
        } else {
          return true;
        }
      },
      beforeStartConnect: (source: any, edgeType: string) => {
        if (this.Connector.BeforeStart) {
          return this.Connector.BeforeStart(source, edgeType);
        } else {
          return true;
        }
      },
      beforeStartDetach: (source: any, target: any, edge: any) => {
        if (this.Connector.BeforeStartDetach) {
          return this.Connector.BeforeStartDetach(source, target, edge);
        } else {
          return true;
        }
      }
    };
  }
}
