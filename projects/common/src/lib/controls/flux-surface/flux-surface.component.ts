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
  SimpleChanges
} from '@angular/core';
import { Guid } from '@lcu-ide/common';
import { jsPlumb, jsPlumbToolkit } from 'jsplumbtoolkit';
import { FluxModuleOption } from '../../models/FluxModuleOption';
import { FluxActionEvent } from '../../models/FluxActionEvent';
import { FluxAction } from '../../models/FluxAction';
import { jsPlumbToolkitComponent } from '../../jsplumb/toolkit/toolkit.component';
import { FluxModuleComponent } from '../flux-module/flux-module.component';
import { FluxParser } from '../../svc/flux-parser';
import { FluxConfigManager } from '../../svc/flux-config-manager';
import { FluxLayout } from '../../models/FluxLayout';
import { FluxOutput } from '../../models/FluxOutput';

@Component({
  selector: 'lcu-flux-surface',
  templateUrl: './flux-surface.component.html',
  styleUrls: ['./flux-surface.component.scss'],
  providers: [FluxConfigManager]
})
export class FluxSurfaceComponent implements AfterViewInit, OnChanges, OnInit {
  //  Fields
  protected minCanvasHeight: number;

  //  Properties
  @Input('actions')
  public Actions: FluxAction[];

  @Output('action')
  public Action: EventEmitter<FluxActionEvent>;

  @Input('changed')
  public Changed: EventEmitter<FluxOutput>;

  @Input('flow')
  public Flow: string;

  @Input('layout')
  public FluxLayout: FluxLayout;

  @Input('options')
  public Options: FluxModuleOption[];

  @Output('on-error')
  public OnError: EventEmitter<{ Error: string; Action: string }>;

  @ViewChild(jsPlumbToolkitComponent)
  public ToolkitComponent: jsPlumbToolkitComponent;

  //  Constructors
  constructor(protected fluxParser: FluxParser, protected fluxCfgMgr: FluxConfigManager) {
    this.Changed = new EventEmitter();

    this.Flow = 'Absolute';

    this.OnError = new EventEmitter();
  }

  //  Life Cycle
  public ngAfterViewInit() {
    //  TODO:  Must be a better way to get rid of the ngIf check error... tied to similar fix in toolkit.component
    setTimeout(() => {
      this.fixJSPlumb();

      const dt = new jsPlumbToolkit.DrawingTools({
        renderer: this.ToolkitComponent.Surface,
        widthAttribute: 'Width',
        heightAttribute: 'Height',
        leftAttribute: 'Left',
        topAttribute: 'Top'
      });

      this.refreshSurface();
    }, 0);
  }

  public ngOnChanges(_: SimpleChanges) {
    if (_['Modules'] || _['__more__']) {
      this.refreshSurface();
    }
  }

  public ngOnInit() {}

  @HostListener('window:keyup', ['$event'])
  public onKeyup(event) {
    if (event.keyCode === 46) {
      const toolkit = this.ToolkitComponent.Toolkit;

      if (toolkit.getSelection().getNodes().length > 1) {
        if (confirm('Delete all selected nodes and connections?')) {
          const nodes = toolkit
            .getSelection()
            .getNodes()
            .map(x => x.id);

          nodes.forEach(node => {
            toolkit.removeNode(node);
          });

          for (let i = 0; i < document.querySelectorAll('.menu-item.menu-item-active').length; i++) {
            document
              .querySelectorAll('.menu-item.menu-item-active')
              .item(i)
              .classList.remove('menu-item-active');

            i--;
          }
        }
      } else if (toolkit.getSelection().getNodes().length === 1) {
        // this.RemoveNode(toolkit.getSelection().getNodes()[0], false);
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.setCanvasHeight();
  }

  //  API Methods
  public ConfigureDroppables(register: boolean, parent: string, selector: string) {
    const toolkit = this.ToolkitComponent.Toolkit;

    const surface = this.ToolkitComponent.Surface;

    const controls = document.querySelector('.controls');

    const dt = new jsPlumbToolkit.DrawingTools({
      renderer: surface,
      widthAttribute: 'Width',
      heightAttribute: 'Height',
      leftAttribute: 'Left',
      topAttribute: 'Top'
    });

    if (register) {
      this.FluxLayout.Palette = surface.registerDroppableNodes({
        source: document.getElementById(parent),
        selector: selector,
        dragOptions: {
          zIndex: 50000,
          cursor: 'move',
          clone: true
        },
        dataGenerator: (type, dragElement, dropInfo, eventLocation) => {
          return JSON.parse(dragElement.getAttribute('option'));
        },
        typeExtractor: (el, dropInfo, isNative, eventLocation) => {
          return el.getAttribute('jtk-node-type');
        }
      });
    }

    this.setMouseUpAction();

    this.setDataUpdatedCallback();
  }

  public BeforeConnect(source: any, target: any, edgeData: any, repressErrors: boolean) {
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

    const sourceOpt = this.Options.find(item => {
      return item.ModuleType === source.data.ModuleType;
    });

    const targetOpt = this.Options.find(item => {
      return item.ModuleType === target.data.ModuleType;
    });

    if (!validControlTypeConnection) {
      if (!repressErrors) {
        this.OnError.emit({
          Error: `Connection between ${sourceOpt.Name} and ${targetOpt.Name} types is not supported.`,
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
        if (this.ToolkitComponent && this.ToolkitComponent.Surface) {
          this.ToolkitComponent.Surface.repaintEverything();
        }
        return true;
      } else if (possibleTypes.some(f => f === target.data.ModuleType)) {
        if (this.ToolkitComponent && this.ToolkitComponent.Surface) {
          this.ToolkitComponent.Surface.repaintEverything();
        }
        return true;
      } else if (!repressErrors) {
        this.OnError.emit({
          Error: `Connection between ${sourceOpt.Name} and ${targetOpt.Name} types is not supported.`,
          Action: 'Dismiss'
        });
      }
    } else if (!repressErrors) {
      this.OnError.emit({
        Error: `Max incoming connections reached for '${targetOpt.Name}'.`,
        Action: 'Dismiss'
      });
    }

    return false;
  }

  public BeforeStartConnect(node: any, edgeType: string) {
    const outgoingEdges = node.getEdges().filter(x => {
      return x.source.id === node.id;
    });

    const nodeOpt = this.Options.find(item => {
      return item.ModuleType === node.data.ModuleType;
    });

    let isValid = false;

    if (node.data.OutgoingConnectionLimit === 0) {
      this.OnError.emit({
        Error: `Outgoing connections not allowed on '${nodeOpt.Name}'.`,
        Action: 'Dismiss'
      });
    } else if (node.data.OutgoingConnectionLimit === -1 || outgoingEdges.length < node.data.OutgoingConnectionLimit) {
      const flowModuleTypes = this.listFlowModuleTypes();
      const moduleOptions = this.Options;

      if (this.Options) {
        let outgoingTypes = [...node.data.OutgoingConnectionTypes];

        moduleOptions.forEach(mo => {
          // if (mo.IncomingConnectionTypes.some(ct => ct === node.data.ModuleType)) {
          //   outgoingTypes.push(mo.ModuleType);
          // }
        });

        outgoingTypes = outgoingTypes.filter((x, i, a) => a.indexOf(x) === i);

        if (!outgoingTypes || outgoingTypes.length === 0) {
          isValid = true;
        } else if (outgoingTypes.some(f => flowModuleTypes.indexOf(f) >= 0)) {
          isValid = true;
        } else {
          this.OnError.emit({ Error: `No supported connection modules for '${node.data.Text}'.`, Action: 'Dismiss' });
        }
      } else {
        return true;
      }
    } else {
      this.OnError.emit({ Error: `Max outgoing connections reached on '${node.data.Text}'.`, Action: 'Dismiss' });
    }

    if (isValid) {
      let validConnections = 0;

      this.ToolkitComponent.Toolkit.getNodes().forEach(target => {
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

  public EdgeMoved(edge: any, oldTarget: any, newTarget: any) {}

  public ExportFlow() {
    const self = this;

    return this.ToolkitComponent.Toolkit.exportData({
      type: 'fathymIO',
      parameters: {
        //  TODO:  rename from flow
        flow: {}//config
      }
    });
  }

  public ModeChanged(mode: string) {
    if (mode === 'pan' && this.ToolkitComponent.Toolkit.getSelection().getNodes().length > 0) {
      for (let i = 0; i < document.querySelectorAll('.menu-item.menu-item-active').length; i++) {
        document
          .querySelectorAll('.menu-item.menu-item-active')
          .item(i)
          .classList.remove('menu-item-active');
        i--;
      }

      const newAdd = true;

      this.ToolkitComponent.Toolkit.getSelection()
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
    jsPlumb.addClass(controls.querySelectorAll("[mode='" + mode + "']"), 'selected-mode');

    this.handleMultiSelect();
  }

  public ObjectRepainted() {
    this.handleMultiSelect();
  }

  public NodeFactory(type: string, data: any, callback: Function) {
    const moduleType = data.Name;

    const name = prompt(`Enter ${data.Name} name:`);

    // const dialogRef = this.dialog.open(SingleInputDialogComponent, {
    //   data: { inputText:    , inputValue: data.Text, title: 'New Node' },
    //   width: '225px'
    // });

    const flowId = '';

    data.Text = name;

    data.Name = name;

    data.Top = data.top;

    data.Left = data.left;

    if (data.Text && data.Text.length >= 2) {
      data.ID = Guid.CreateRaw();

      data.id = data.ID;

      callback(data);

      setTimeout(() => {
        data.Status = { Code: -100 };

        // this.mgrDialog = this.dialog.open(FlowManagerComponent, {
        //   disableClose: true,
        //   panelClass: 'module-manager-container',
        //   data: <FlowManagerData>{
        //     IncommingModules: {
        //       _app: 'IoTFlow:IncommingModules',
        //       Items: []
        //     },
        //     ManagementPath: data.ManagementPath,
        //     ManagerHeight: data.ManagerHeight,
        //     ManagerWidth: data.ManagerWidth,
        //     OutgoingModules: {
        //       _app: 'IoTFlow:OutgoingModules',
        //       Items: []
        //     },
        //     SchemaOptions: [],
        //     Settings: data.Settings || {},
        //     Token: data.Token,
        //     UnavailableLookups: this.ToolkitComponent.toolkit
        //       .getNodes()
        //       .filter((item) => {
        //         return item.data.Service === data.Service && item.data.Settings;
        //       })
        //       .map((item) => {
        //         return {
        //           Lookup: item.data.Settings.Lookup,
        //           SubLookups: item.data.Settings.SubLookups
        //             ? item.data.Settings.SubLookups.filter((item) => {
        //                 x => x.Lookup === item.data.Settings.Lookup;
        //               })
        //             : null
        //         };
        //       }),
        //     ModuleTypeName: data.Name,
        //     FirstLoad: true,
        //     Application: data.Application,
        //     Service: data.Service,
        //     FlowID: flowId
        //   }
        // });

        // this.mgrDialog.afterClosed().subscribe(result => {
        //   if (!this.ToolkitComponent.toolkit.getNode(data.id).data.Settings) {
        //     this.ToolkitComponent.toolkit.removeNode(data.id);
        //   }
        // });
      }, 200);
    } else {
      this.OnError.emit({ Error: moduleType + ' names must be at least 2 characters.', Action: 'Dismiss' });
    }
  }

  public NodeResolver(typeId: string) {
    return FluxModuleComponent;
  }

  public Relayout() {
    if (confirm('Are you sure you want to relayout the flow?')) {
      const surface = this.ToolkitComponent.Surface;

      const toolkit = this.ToolkitComponent.Toolkit;

      //  TODO:  Understand why this was set to Hierearchal here, when set to 'Absolute' above?
      //    Which should be the default or should this always be Hierarchal?
      surface.setLayout({
        type: 'Hierarchical',
        parameters: {
          padding: [150, 150],
          orientation: 'vertical'
        }
      });

      const layoutObjs = surface.getLayout().getPositions();

      const tmpHolder = [];

      Object.keys(layoutObjs).forEach(item => {
        tmpHolder.push({ id: item, top: layoutObjs[item][1], left: layoutObjs[item][0] });
      });

      tmpHolder.forEach(item => {
        const node = toolkit.getNode(item.id);
        if (node) {
          node.data.Top = item.top;

          node.data.Left = item.left;
        }
      });

      surface.zoomToFit();

      setTimeout(() => {
        surface.setLayout({
          type: this.Flow
        });
      }, 1000);
    }
  }

  public SetPanMode() {
    this.ToolkitComponent.Surface.setMode('pan');
  }

  public SetSelectMode() {
    this.ToolkitComponent.Surface.setMode('select');
  }

  public RemoveEdge(edge: any) {
    if (confirm(`Delete edge between '${edge.source.data.Text}' and '${edge.target.data.Text}'?`)) {
      this.ToolkitComponent.Toolkit.removeEdge(edge);

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

    this.ToolkitComponent.Toolkit.getSelection()
      .getNodes()
      .forEach((n) => {
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

    this.ToolkitComponent.Toolkit.toggleSelection(node);
  }

  public UpdateSettings(nodeId: string, settings: any) {
    const info = this.ToolkitComponent.Surface.getObjectInfo(nodeId);

    info.obj.data.Settings = settings;

    this.ToolkitComponent.Toolkit.updateNode(info.obj, info.obj.data);
  }

  public ZoomToFit() {
    this.ToolkitComponent.Toolkit.clearSelection();

    this.ToolkitComponent.Surface.zoomToFit();
  }

  // 	Helpers
  protected fixJSPlumb() {
    const self = this;

    this.ToolkitComponent.Toolkit.addFactoryNode = function(type, data, callback) {
      data = arguments.length >= 2 && (arguments[1] == null || typeof arguments[1] === 'object') ? arguments[1] : {};

      callback = arguments.length === 3 ? arguments[2] : typeof arguments[1] === 'function' ? arguments[1] : null;

      data.type = data.type || type;

      self.ToolkitComponent.Toolkit.getNodeFactory()(
        type,
        data,
        function(n) {
          const node = this.ToolkitComponent.toolkit.addNode(n);

          if (callback) {
            callback(node);
          }
        }.bind(self)
      );
    };
  }

  protected handleMultiSelect() {
    if (this.ToolkitComponent.Toolkit.getSelection().getNodes().length > 1) {
      jsPlumb.addClass(document.querySelectorAll('.node-action'), 'node-action-hidden');
      jsPlumb.removeClass(document.querySelectorAll('.node-delete'), 'node-action-hidden');
    } else {
      jsPlumb.removeClass(document.querySelectorAll('.node-action'), 'node-action-hidden');
    }

    this.ToolkitComponent.Toolkit.getSelection()
      .getNodes()
      .forEach(node => {
        this.registerSelectionCanvasEvents(node);
      });
  }

  protected listFlowModuleTypes() {
    return this.ToolkitComponent.Toolkit.getNodes()
      .map(n => {
        return n.data.ModuleType;
      })
      .filter((x, i, a) => a.indexOf(x) === i);
  }

  public mapFluxConfig() {
    this.ToolkitComponent.Toolkit.load({
      type: 'fathymIO',
      data: {}, //this.Config,
      onload: () => {
        this.ToolkitComponent.Surface.repaintEverything();

        setTimeout(() => {
          this.ToolkitComponent.Surface.setLayout({
            type: this.Flow,
            parameters: {
              padding: [150, 150]
            }
          });

          this.ToolkitComponent.Surface.zoomToFit();
        }, 0);
      }
    });
  }

  protected newToken() {
    return Guid.Create().ToString();
  }

  protected prepareNodesAndPorts() {
    if (this.Options) {
      this.Options.forEach(mdl => {
        Object.keys(this.FluxLayout.View.nodes).push(mdl.ModuleType);

        Object.keys(this.FluxLayout.View.ports).push(mdl.ModuleType);

        this.FluxLayout.View.nodes[mdl.ModuleType] = {
          parent: 'selectable'
        };

        this.FluxLayout.View.ports[mdl.ModuleType] = {
          maxConnections: 1
        };
      });
    }
  }

  protected refreshSurface() {
    if (this.Options && this.ToolkitComponent.Toolkit) {
      this.fluxCfgMgr.Configure(this.Flow, this.NodeFactory).subscribe(layout => {
        this.FluxLayout = layout;

        if (this.FluxLayout) {
          setTimeout(() => {
            if (this.FluxLayout.Palette) {
              this.FluxLayout.Palette.refresh();
            }
          }, 0);

          this.mapFluxConfig();

          this.prepareNodesAndPorts();
        }
      });

      this.fluxCfgMgr.Connector.Before.subscribe(e => this.BeforeConnect(e.Source, e.Target, e.EdgeData, false));

      this.fluxCfgMgr.Connector.BeforeStart.subscribe(e => this.BeforeStartConnect(e.Node, e.EdgeType));

      this.fluxCfgMgr.Connector.BeforeStartDetach.subscribe(e => this.BeforeStartDetach(e.Source, e.Target, e.Edge));

      this.fluxCfgMgr.Connector.Click.subscribe(e => this.ConnectionClick(e));

      // this.fluxCfgMgr.CreateNode.subscribe(e => e.Factory = this.NodeFactory);

      this.fluxCfgMgr.Edge.Added.subscribe(e => this.EdgeAdded(e));

      this.fluxCfgMgr.Edge.DoubleClick.subscribe(e => this.RemoveEdge(e.edge));

      // this.fluxCfgMgr.Edge.Target.subscribe(e => this.___);

      this.fluxCfgMgr.Edge.DoubleClick.subscribe(e => this.RemoveEdge(e.edge));

      this.fluxCfgMgr.ModeChanged.subscribe(mode => this.ModeChanged(mode));

      this.fluxCfgMgr.Repainted.subscribe(e => this.ObjectRepainted());

      this.fluxCfgMgr.ToggleSelection.subscribe(e => this.ToggleSelection(e.node));
    }
  }

  protected registerSelectionCanvasEvents(node: any) {
    const events: any[] = [];

    // events.push(<any>{
    //   Data: node.data,
    //   Event: 'click',
    //   Function: self.EditNode,
    //   Identifier: "[data-jtk-node-id='" + node.id + "'] > div > div.node-edit"
    // });

    // events.push(<any>{
    //   Data: node.data,
    //   Event: 'click',
    //   Function: self.RemoveNode,
    //   Identifier: "[data-jtk-node-id='" + node.id + "'] > div > div.node-delete"
    // });

    // this.registerCanvasEvents(events, false);
  }

  protected setCanvasHeight() {
    let height = window.innerHeight - 20;

    if (height < this.minCanvasHeight) {
      height = this.minCanvasHeight;
    }

    for (let i = 0; i < document.getElementsByClassName('jtk-surface').length; i++) {
      (<HTMLElement>document.getElementsByClassName('jtk-surface')[i]).style.height = height.toString() + 'px';
    }

    if (document.getElementsByClassName('miniview').length > 0) {
      (<HTMLElement>document.getElementsByClassName('miniview')[0]).style.top = (height - 127 - 25).toString() + 'px';
    }
  }

  protected setMouseUpAction() {
    window.onmouseup = (ev: MouseEvent) => {
      let els = document.querySelectorAll('.connection-drop-disabled');

      for (let i = 0; i < els.length; i++) {
        els[i].className = els[i].className.replace(' connection-drop-disabled', '');
      }

      els = document.querySelectorAll('.connection-drop-enabled');

      for (let i = 0; i < els.length; i++) {
        els[i].className = els[i].className.replace(' connection-drop-enabled', '');
      }

      this.handleMultiSelect();
    };
  }

  protected setDataUpdatedCallback() {
    const toolkit = this.ToolkitComponent.Toolkit;

    toolkit.bind('dataUpdated', () => {
      this.Changed.emit();
    });
  }
}
