import {
  Component,
  OnInit,
  Input,
  ViewChild,
  HostListener,
  AfterViewInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  HostBinding,
  ElementRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef,
  OnDestroy,
  ComponentFactory
} from '@angular/core';
import { jsPlumb, jsPlumbToolkit, Surface } from 'jsplumbtoolkit';
import { FluxModuleOption } from '../../models/FluxModuleOption';
import { FluxActionEvent } from '../../models/FluxActionEvent';
import { FluxModuleComponent } from '../flux-module/flux-module.component';
import { FluxParser } from '../../svc/flux-parser';
import { FluxConfigManager } from '../../svc/flux-config-manager';
import { FluxLayout } from '../../models/FluxLayout';
import { FluxOutput } from '../../models/FluxOutput';
import { FluxModule } from '../../models/FluxModule';
import { FluxStream } from '../../models/FluxStream';
import { FluxModulesValidation } from '../../models/FluxModulesValidation';
import { Subscription } from 'rxjs';
import { LCUjsPlumbService } from '../../svc/lcu-jsplumb.service';

@Component({
  selector: 'lcu-flux-surface',
  templateUrl: './flux-surface.component.html',
  styleUrls: ['./flux-surface.component.scss']
})
export class FluxSurfaceComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {
  //  Fields
  protected createdComps: ComponentRef<FluxModuleComponent>[];

  protected fluxCfgMgrSubs: { [sub: string]: Subscription };

  protected fluxLayout: FluxLayout;

  protected init: boolean;

  protected surface: Surface;

  protected toolkit: jsPlumbToolkit;

  //  Properties
  @Output('action')
  public Action: EventEmitter<FluxActionEvent>;

  @Input('changed')
  public Changed: EventEmitter<FluxOutput>;

  @HostBinding('class')
  public Class = 'jtk-surface-canvas jtk-surface jtk-droppable';

  @Input('flux')
  public FluxID: string;

  @Input('layout')
  public Layout: string;

  @Input('modules')
  public Modules: FluxModule[];

  @Output('on-error')
  public OnError: EventEmitter<{ Error: string; Action: string }>;

  @Input('streams')
  public Streams: FluxStream[];

  @HostBinding('style.display')
  public StyleDisplay = 'block';

  @Input('surface')
  public SurfaceID: string;

  @Input('validation')
  public Validation: FluxModulesValidation;

  //  Constructors
  constructor(
    protected fluxParser: FluxParser,
    protected fluxCfgMgr: FluxConfigManager,
    protected jsplumb: LCUjsPlumbService,
    protected el: ElementRef,
    protected compFactory: ComponentFactoryResolver,
    protected viewContainerRef: ViewContainerRef
  ) {
    this.createdComps = [];

    this.fluxCfgMgrSubs = {};

    this.Changed = new EventEmitter();

    this.Layout = 'Absolute';

    this.OnError = new EventEmitter();
  }

  //  Life Cycle
  public ngAfterViewInit() {
    this.refreshSurface();
  }

  public ngOnChanges(_: SimpleChanges) {
    //  TODO:  Need to be able to handle changes... however, just duplicates nodes...
    if (this.init && (_['Modules'] || _['Streams'] || _['Validation'])) {
      this.refreshSurface();
    }
  }

  public ngOnDestroy(): void {
    if (this.createdComps) {
      this.createdComps.forEach(cc => {
        cc.changeDetectorRef.detach();

        cc.destroy();
      });

      this.createdComps = [];
    }
  }

  public ngOnInit() {}

  //  API Methods
  public BeforeConnect(source: any, target: any, edgeData: any, repressErrors?: boolean) {
    if (this.Modules) {
      if (target.id === source.id) {
        return false;
      }

      const incomingEdges = target.getEdges().filter(x => {
        return x.target.id === target.id;
      });

      let validControlTypeConnection = true;
      switch (source.data.ControlType) {
        case 'Direct':
          {
            if (target.data.ControlType !== 'Gate') {
              validControlTypeConnection = false;
            }
          }
          break;
        case 'Flow':
          {
            if (target.data.ControlType === 'Direct') {
              validControlTypeConnection = false;
            }
          }
          break;
        case 'Gate':
          {
          }
          break;
      }

      const sourceOpt = this.Modules.find(item => {
        return item.ModuleType === source.data.ModuleType;
      });

      const targetOpt = this.Modules.find(item => {
        return item.ModuleType === target.data.ModuleType;
      });

      if (!validControlTypeConnection) {
        if (!repressErrors) {
          this.OnError.emit({
            Error: `Connection between ${sourceOpt.Text} and ${targetOpt.Text} types is not supported.`,
            Action: 'Dismiss'
          });
        }
        return false;
      }

      if (target.data.IncomingConnectionLimit === 0 && !repressErrors) {
        this.OnError.emit({ Error: "Incoming connections not allowed on '" + target.data.Text + "'.'", Action: 'Dismiss' });
      } else if (target.data.IncomingConnectionLimit === -1 || incomingEdges.length < target.data.IncomingConnectionLimit) {
        const possibleTypes = [...source.data.OutgoingConnectionTypes, ...target.data.IncomingConnectionTypes].filter(
          (x, i, a) => a.indexOf(x) === i
        );

        if (!possibleTypes || possibleTypes.length === 0) {
          if (this.surface) {
            this.surface.repaintEverything();
          }
          return true;
        } else if (possibleTypes.some(f => f === target.data.ModuleType)) {
          if (this.surface) {
            this.surface.repaintEverything();
          }
          return true;
        } else if (!repressErrors) {
          this.OnError.emit({
            Error: `Connection between ${sourceOpt.Text} and ${targetOpt.Text} types is not supported.`,
            Action: 'Dismiss'
          });
        }
      } else if (!repressErrors) {
        this.OnError.emit({
          Error: `Max incoming connections reached for '${targetOpt.Text}'.`,
          Action: 'Dismiss'
        });
      }

      return false;
    }

    return true;
  }

  public BeforeStartConnect(node: any, edgeType: string) {
    if (this.Modules) {
      const outgoingEdges = node.getEdges().filter(x => {
        return x.source.id === node.id;
      });

      const mdl = <FluxModule>node.data;

      const nodeOpt = this.Modules.find(item => {
        return item.ModuleType === mdl.ModuleType;
      });

      let isValid = false;

      const outConnLimit = this.Validation.Connection.Outgoing.Limit[mdl.ModuleType];

      if (outConnLimit && outConnLimit === 0) {
        this.OnError.emit({
          Error: `Outgoing connections not allowed on '${nodeOpt.Text}'.`,
          Action: 'Dismiss'
        });
      } else if (!outConnLimit || outConnLimit === -1 || outgoingEdges.length < outConnLimit) {
        const flowModuleTypes = this.listFlowModuleTypes();

        if (this.Modules) {
          let outgoingTypes = [...this.Validation.Connection.Outgoing.Types[mdl.ModuleType]];

          this.Modules.forEach(mo => {
            if (this.Validation.Connection.Outgoing.Types[mdl.ModuleType].some(ct => ct === mdl.ModuleType)) {
              outgoingTypes.push(mo.ModuleType);
            }
          });

          outgoingTypes = outgoingTypes.filter((x, i, a) => a.indexOf(x) === i);

          if (!outgoingTypes || outgoingTypes.length === 0) {
            isValid = true;
          } else if (outgoingTypes.some(f => flowModuleTypes.indexOf(f) >= 0)) {
            isValid = true;
          } else {
            this.OnError.emit({ Error: `No supported connection modules for '${mdl.Text}'.`, Action: 'Dismiss' });
          }
        } else {
          return true;
        }
      } else {
        this.OnError.emit({ Error: `Max outgoing connections reached on '${mdl.Text}'.`, Action: 'Dismiss' });
      }

      if (isValid) {
        let validConnections = 0;

        this.toolkit.getNodes().forEach(target => {
          if (!this.BeforeConnect(node, target, null, true)) {
            document.querySelector(`[data-jtk-node-id='${target.id}']`).className += ' connection-drop-disabled';
          } else {
            document.querySelector(`[data-jtk-node-id='${target.id}']`).className += ' connection-drop-enabled';
            validConnections++;
          }
        });

        if (!validConnections) {
          this.OnError.emit({ Error: 'No valid connections currently available.', Action: 'Dismiss' });
          return false;
        } else {
          return true;
        }
      }

      return false;
    }

    return true;
  }

  public BeforeStartDetach(source: any, target: any, edge: any) {
    return true;
  }

  public ConnectionClick(params: any) {}

  public EdgeAdded(params: any) {
    const self = this;
    if (params.addedByMouse) {
      if (params.target.data.Service === 'DataMap' || params.source.data.Service === 'DataMap') {
        let data;
        if (params.source.data.Service === 'DataMap') {
          data = params.source.data;
        } else if (params.target.data.Service === 'DataMap') {
          data = params.target.data;
        }

        // setTimeout(() => {
        //   this.mgrDialog = this.dialog.open(FlowManagerComponent, {
        //     disableClose: true,
        //     panelClass: 'module-manager-container',
        //     data: <FlowManagerData>{
        //       IncommingModules: {
        //         _app: 'IoTFlow:IncommingModules',
        //         Items: this.ToolkitComponent.toolkit
        //           .getNode(data.id)
        //           .getEdges()
        //           .filter((item) => {
        //             return item.target.id === data.id;
        //           })
        //           .map(x => {
        //             let sid = '';

        //             if (
        //               x.source.data &&
        //               x.source.data &&
        //               x.source.data.Settings &&
        //               x.source.data.Settings.SchemaFlow &&
        //               x.source.data.Settings.SchemaFlow.SchemaNodes &&
        //               x.source.data.Settings.SchemaFlow.SchemaNodes.length > 0
        //             ) {
        //               const ogNodes = x.source.data.Settings.SchemaFlow.SchemaNodes.filter((item) => {
        //                 return item.Data.SchemaType === 'outgoing' && item.OutgoingModuleIDs.indexOf(data.id) > -1;
        //               });

        //               if (ogNodes.length > 0) {
        //                 sid = ogNodes[0].JSONSchemaID;
        //               }
        //             }

        //             return {
        //               id: x.source.id,
        //               name: x.source.data.Text,
        //               schemaId: sid
        //             };
        //           })
        //       },
        //       ManagementPath: data.ManagementPath,
        //       ManagerHeight: data.ManagerHeight,
        //       ManagerWidth: data.ManagerWidth,
        //       OutgoingModules: {
        //         _app: 'IoTFlow:OutgoingModules',
        //         Items: this.ToolkitComponent.toolkit
        //           .getNode(data.id)
        //           .getEdges()
        //           .filter((item) => {
        //             return item.source.id === data.id;
        //           })
        //           .map(x => {
        //             return {
        //               id: x.target.id,
        //               name: x.target.data.Text,
        //               type: x.target.data.Service,
        //               status: x.target.data.Status
        //             };
        //           })
        //       },
        //       SchemaOptions: [],
        //       Settings: data.Settings || {},
        //       Token: data.Token,
        //       UnavailableLookups: this.ToolkitComponent.toolkit
        //         .getNodes()
        //         .filter((item) => {
        //           return item.data.Service === data.Service && item.data.Settings;
        //         })
        //         .map((item) => {
        //           return {
        //             Lookup: item.data.Settings.Lookup,
        //             SubLookups: item.data.Settings.SubLookups
        //               ? item.data.Settings.SubLookups.filter((item) => {
        //                   x => x.Lookup === item.data.Settings.Lookup;
        //                 })
        //               : null
        //           };
        //         }),
        //       ModuleTypeName: data.Text,
        //       FirstLoad: false,
        //       Application: data.Application,
        //       Service: data.Service,
        //       FlowID: this.flowId
        //     }
        //   });

        //   this.mgrDialog.afterClosed().subscribe(result => {
        //     if (result && result.confirm) {
        //       if (params.source.data.Service === 'DataMap' && params.target.data.Service === 'DataMap') {
        //         const outConnections = params.source.data.Settings.SchemaFlow.SchemaNodes.filter((node) => {
        //           return node.OutgoingModuleIDs.indexOf(params.target.id) > -1;
        //         });

        //         if (outConnections && outConnections.length > 0) {
        //           const outConnection = outConnections[0];

        //           if (!params.target.data.Settings) {
        //             params.target.data.Settings = { IsDeleted: false };
        //           }

        //           if (!params.target.data.Settings.SchemaFlow) {
        //             params.target.data.Settings.SchemaFlow = { SchemaNodes: [] };
        //           }

        //           const schemaId = outConnection.JSONSchemaID;

        //           const existing = params.target.data.Settings.SchemaFlow.SchemaNodes.filter((sNode) => {
        //             return sNode.Data.SchemaType === 'incomming' && sNode.JSONSchemaID === schemaId && !sNode.IncommingModuleID;
        //           });

        //           if (existing && existing.length > 0) {
        //             existing[0].IncommingModuleID = params.source.id;
        //           } else {
        //             let top = 0;
        //             let left = 9000;

        //             params.target.data.Settings.SchemaFlow.SchemaNodes.filter(x => {
        //               return x.Data.SchemaType === 'incomming';
        //             }).forEach(node => {
        //               const currentTop = node.Data.Top + 150;
        //               const currentLeft = node.Data.Left;
        //               if (currentTop > top) {
        //                 top = currentTop;
        //               }
        //               if (currentLeft < left) {
        //                 left = currentLeft;
        //               }
        //             });

        //             top += 50;

        //             const id = Guid.CreateRaw();
        //             const schemaNode = {
        //               ID: id,
        //               Data: {
        //                 id: id,
        //                 SchemaType: 'incomming',
        //                 type: 'schema',
        //                 Name: outConnection.Data.Name,
        //                 Top: top,
        //                 Left: left
        //               },
        //               JSONSchemaID: schemaId,
        //               IncommingModuleID: params.source.id,
        //               OutgoingModuleIDs: [],
        //               JoinRelationships: [],
        //               DisableSchemaEdit: true,
        //               Left: -200
        //             };

        //             params.target.data.Settings.SchemaFlow.SchemaNodes.push(schemaNode);
        //           }
        //         }
        //       }
        //     } else {
        //       this.ToolkitComponent.toolkit.removeEdge(params.edge);

        //       const edge = params.edge;

        //       if (edge.target.data.Service === 'DataMap' || edge.source.data.Service === 'DataMap') {
        //         let inModule;
        //         let outModule;
        //         if (edge.target.data.Service === 'DataMap') {
        //           inModule = edge.target.data;
        //         }
        //         if (edge.source.data.Service === 'DataMap') {
        //           outModule = edge.source.data;
        //         }

        //         if (inModule) {
        //           if (inModule.Settings && inModule.Settings.SchemaFlow && inModule.Settings.SchemaFlow.SchemaNodes) {
        //             const nodes = inModule.Settings.SchemaFlow.SchemaNodes.filter((node) => {
        //               return node.IncommingModuleID && node.IncommingModuleID === edge.source.id;
        //             }).forEach((node) => {
        //               node.IncommingModuleID = '';
        //             });
        //           }
        //         }
        //         if (outModule) {
        //           if (outModule.Settings && outModule.Settings.SchemaFlow && outModule.Settings.SchemaFlow.SchemaNodes) {
        //             const nodes = outModule.Settings.SchemaFlow.SchemaNodes.filter((node) => {
        //               return node.OutgoingModuleID && node.OutgoingModuleIDs.indexOf(edge.target.id) > -1;
        //             }).forEach((node) => {
        //               node.OutgoingModuleIDs.splice(node.OutgoingModuleIDs.indexOf(edge.target.id), 1);
        //             });
        //           }
        //         }
        //       }
        //     }
        //   });
        // }, 200);
      }
    }
  }

  public Export() {
    return this.toolkit.exportData({
      type: 'fathymIO',
      parameters: {
        surface: this
      }
    });
  }

  public ModeChanged(mode: string) {
    if (mode === 'pan' && this.toolkit.getSelection().getNodes().length > 0) {
      for (let i = 0; i < document.querySelectorAll('.menu-item.menu-item-active').length; i++) {
        document
          .querySelectorAll('.menu-item.menu-item-active')
          .item(i)
          .classList.remove('menu-item-active');
        i--;
      }

      const newAdd = true;

      this.toolkit
        .getSelection()
        .getNodes()
        .forEach(n => {
          document
            .querySelectorAll('.menu-item.' + n.data.Service)
            .item(0)
            .classList.add('menu-item-active');
        });
    }
    const controls = document.querySelector('.controls');
    jsPlumb.removeClass(controls.querySelectorAll('[mode]'), 'selected-mode');
    jsPlumb.addClass(controls.querySelectorAll(`[mode='` + mode + `']`), 'selected-mode');

    this.handleMultiSelect();
  }

  public ObjectRepainted() {
    this.handleMultiSelect();
  }

  public Relayout() {
    if (confirm('Are you sure you want to relayout the flow?')) {
    }
  }

  public RemoveEdge(edge: any) {
    if (confirm(`Delete edge between '${edge.source.data.Text}' and '${edge.target.data.Text}'?`)) {
      this.toolkit.removeEdge(edge);

      if (edge.target.data.Service === 'DataMap' || edge.source.data.Service === 'DataMap') {
        let inModule;
        let outModule;
        if (edge.target.data.Service === 'DataMap') {
          inModule = edge.target.data;
        }
        if (edge.source.data.Service === 'DataMap') {
          outModule = edge.source.data;
        }

        if (inModule) {
          if (inModule.Settings && inModule.Settings.SchemaFlow && inModule.Settings.SchemaFlow.SchemaNodes) {
            const nodes = inModule.Settings.SchemaFlow.SchemaNodes.filter(node => {
              return node.IncommingModuleID && node.IncommingModuleID === edge.source.id;
            }).forEach(node => {
              inModule.Settings.HasErrors = true;
              node.IncommingModuleID = '';
            });
          }
        }
        if (outModule) {
          if (outModule.Settings && outModule.Settings.SchemaFlow && outModule.Settings.SchemaFlow.SchemaNodes) {
            const nodes = outModule.Settings.SchemaFlow.SchemaNodes.filter(node => {
              return node.OutgoingModuleIDs && node.OutgoingModuleIDs.indexOf(edge.target.id) > -1;
            }).forEach(node => {
              node.OutgoingModuleIDs.splice(node.OutgoingModuleIDs.indexOf(edge.target.id), 1);
              if (node.OutgoingModuleIDs.length === 0) {
                outModule.Settings.HasErrors = true;
              }
            });
          }
        }
      }
    }
  }

  public ToggleSelection(node: any) {
    if (node.data.Status && node.data.Status.Code && node.data.Status.Code === 100) {
      this.OnError.emit({ Error: 'Module Unavailable While Loading', Action: 'DISMISS' });

      return;
    }

    for (let i = 0; i < document.querySelectorAll('.menu-item.menu-item-active').length; i++) {
      document
        .querySelectorAll('.menu-item.menu-item-active')
        .item(i)
        .classList.remove('menu-item-active');
      i--;
    }

    let newAdd = true;

    this.toolkit
      .getSelection()
      .getNodes()
      .forEach(n => {
        if (n.id !== node.id) {
          document
            .querySelectorAll('.menu-item.' + n.data.Service)
            .item(0)
            .classList.add('menu-item-active');
        }

        if (n.id === node.id) {
          newAdd = false;
        }
      });

    if (newAdd) {
      document
        .querySelectorAll('.menu-item.' + node.data.Service)
        .item(0)
        .classList.add('menu-item-active');
    }

    this.toolkit.toggleSelection(node);
  }

  // 	Helpers
  protected buildFluxModuleComponent(compFactory: ComponentFactory<FluxModuleComponent>, mdl: FluxModule, toolkit: jsPlumbToolkit) {
    const createdComponent = this.viewContainerRef.createComponent(compFactory);

    createdComponent.instance.Module = mdl;

    createdComponent.instance.Toolkit = toolkit;

    createdComponent.instance.Surface = this.surface;

    return createdComponent;
  }

  protected cleanCfgMgrSubs() {
    const subs = Object.keys(this.fluxCfgMgrSubs);

    //  Clean up old subscriptions on refresh
    subs.forEach(s => {
      this.fluxCfgMgrSubs[s].unsubscribe();

      delete this.fluxCfgMgrSubs[s];
    });
  }

  protected handleMultiSelect() {
    if (this.toolkit.getSelection().getNodes().length > 1) {
      jsPlumb.addClass(document.querySelectorAll('.node-action'), 'node-action-hidden');
      jsPlumb.removeClass(document.querySelectorAll('.node-delete'), 'node-action-hidden');
    } else {
      jsPlumb.removeClass(document.querySelectorAll('.node-action'), 'node-action-hidden');
    }

    this.toolkit
      .getSelection()
      .getNodes()
      .forEach(node => {
        // this.registerSelectionCanvasEvents(node);
      });
  }

  protected listFlowModuleTypes() {
    return this.toolkit
      .getNodes()
      .map(n => {
        return n.data.ModuleType;
      })
      .filter((x, i, a) => a.indexOf(x) === i);
  }

  public mapSurface() {
    if (this.toolkit) {
      this.toolkit.load({
        type: 'fathymIO',
        data: this,
        onload: () => {
          this.surface.repaintEverything();

          setTimeout(() => {
            this.surface.setLayout({
              type: this.Layout,
              parameters: {
                padding: [150, 150]
              }
            });

            this.surface.zoomToFit();
          }, 0);
        }
      });
    }
  }

  protected prepareNodesAndPorts() {
    if (this.Modules) {
      //  TODO:  This may not be correct, was keying on options previously, but options aren't passed to surface any longer...
      this.Modules.forEach(mdl => {
        Object.keys(this.fluxLayout.View.nodes).push(mdl.ModuleType);

        Object.keys(this.fluxLayout.View.ports).push(mdl.ModuleType);

        this.fluxLayout.View.nodes[mdl.ModuleType] = {
          parent: 'selectable'
        };

        this.fluxLayout.View.ports[mdl.ModuleType] = {
          maxConnections: 1
        };
      });
    }
  }

  protected processFluxModuleComponent(compRef: ComponentRef<FluxModuleComponent>) {
    const nativeElement = this.el.nativeElement;

    compRef.instance.UpdateToolkit();

    (<any>compRef)._component._el = nativeElement;

    (<any>compRef)._component._el._jsPlumbNgComponent = (<any>compRef)._component;

    compRef.instance['_el'] = nativeElement;

    compRef.instance['_el']._jsPlumbNgComponent = compRef.instance;

    compRef.changeDetectorRef.detectChanges();

    // const methods = this.methods || {};

    // for (const m in methods) {
    //   if (methods.hasOwnProperty(m)) {
    //     compRef.instance[m] = methods[m];
    //   }
    // }

    return compRef.instance.GetNativeElement();
  }

  protected refreshCfgMgrSubs() {
    this.cleanCfgMgrSubs();

    // this.fluxCfgMgrSubs['CanvasClick'] = this.fluxCfgMgr.CanvasClick.subscribe(e => console.log('click'));

    this.fluxCfgMgr.Connector.Before = this.BeforeConnect;

    this.fluxCfgMgr.Connector.BeforeStart = this.BeforeStartConnect;

    this.fluxCfgMgr.Connector.BeforeStartDetach = this.BeforeStartDetach;

    this.fluxCfgMgrSubs['Connector.Click'] = this.fluxCfgMgr.Connector.Click.subscribe(e => this.ConnectionClick(e));

    // this.fluxCfgMgrSubs['CreateNode'] = this.fluxCfgMgr.CreateNode.subscribe(e => e.Factory = this.NodeFactory);

    this.fluxCfgMgrSubs['Edge.Added'] = this.fluxCfgMgr.Edge.Added.subscribe(e => this.EdgeAdded(e));

    this.fluxCfgMgrSubs['Edge.DoubleClick'] = this.fluxCfgMgr.Edge.DoubleClick.subscribe(e => this.RemoveEdge(e.edge));

    // this.fluxCfgMgrSubs['Edge.Target'] = this.fluxCfgMgr.Edge.Target.subscribe(e => this.___);

    this.fluxCfgMgrSubs['ModeChanged'] = this.fluxCfgMgr.ModeChanged.subscribe(mode => this.ModeChanged(mode));

    this.fluxCfgMgrSubs['Repainted'] = this.fluxCfgMgr.Repainted.subscribe(e => this.ObjectRepainted());

    this.fluxCfgMgrSubs['ToggleSelection'] = this.fluxCfgMgr.ToggleSelection.subscribe(e => this.ToggleSelection(e.node));
  }

  protected refreshSurface() {
    if (this.Modules && this.Streams && this.Validation) {
      const id = this.FluxID;

      if (!id) {
        throw new Error('jtk-id attribute not specified on jsplumb-toolkit component');
      }

      const compFactory = this.compFactory.resolveComponentFactory(FluxModuleComponent);

      this.ngOnDestroy();

      this.fluxCfgMgr.Configure(this.Layout).subscribe(layout => {
        this.fluxLayout = layout;

        this.toolkit = this.jsplumb.GetToolkit(id, this.fluxLayout.Toolkit || {}, true);

        console.log(this.fluxLayout);

        if (this.fluxLayout) {
          const renderParams = jsPlumb.extend(this.fluxLayout.Renderer || {}, {
            templateRenderer: (directiveId: string, data: FluxModule, toolkit: jsPlumbToolkit, objectType: string) => {
              const compRef = this.buildFluxModuleComponent(compFactory, data, toolkit);

              return this.processFluxModuleComponent(compRef);
            },
            view: this.fluxLayout.View,
            container: this.el.nativeElement
          });

          this.surface = this.toolkit.render(renderParams);

          this.jsplumb.AddSurface(this.SurfaceID, this.surface);

          this.toolkit.unbind('nodeUpdated');

          this.toolkit.bind('nodeUpdated', (params: any) => {
            const info = this.surface.getObjectInfo(params.node);

            if (info._el && info._el._jsPlumbNgComponent) {
              info._el._jsPlumbNgComponent.Module = params.node.data;
            }
          });

          // setTimeout(() => {
          //   if (this.fluxLayout.Palette) {
          //     this.fluxLayout.Palette.refresh();
          //   }
          // }, 0);

          this.mapSurface();

          this.prepareNodesAndPorts();

          this.refreshCfgMgrSubs();
        }
      });
    }
  }
}
