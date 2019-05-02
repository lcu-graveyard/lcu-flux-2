import { Component, OnInit, ElementRef } from '@angular/core';
import { Guid } from '@lcu-ide/common';
import { jsPlumb, jsPlumbToolkit, Surface } from 'jsplumbtoolkit';
import { FluxModule } from '../../models/FluxModule';

@Component({
  selector: 'lcu-flux-module',
  templateUrl: './flux-module.component.html',
  styleUrls: ['./flux-module.component.scss']
})
export class FluxModuleComponent implements OnInit {
  // 	Fields
  public Module: FluxModule;

  public Surface: Surface;

  public Toolkit: jsPlumbToolkit;

  // 	Properties

  // 	Constructors
  constructor(protected el: ElementRef) {}

  // 	Runtime

  public ngOnInit() {
    // window.addEventListener(
    //   'message',
    //   ev => {
    //     const data = this.shouldHandle('IoTFlow', ev);
    //   },
    //   false
    // );
  }

  // 	API Methods
  public Abs(input: number) {
    return Math.abs(input);
  }

  public AbsPX(input: number) {
    return `${this.Abs(input)}px`;
  }

  public GetNativeElement() {
    return this.el.nativeElement;
  }

  public UpdateToolkit() {
    if (this.Toolkit) {
      this.Toolkit.updateNode(this.Toolkit.getNode(this.Module.ID), this.Module);
    }
  }

  public OpenFlowManager(node: any) {
    const self = this;
    const flowId = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];

    // runOnRouteParam(this.route, 'id', (params) => {
    //    flowId = params['id'];
    // });

    // this.mgrDialog = this.dialog.open(FlowManagerComponent, {
    //   disableClose: true,
    //   panelClass: 'module-manager-container',
    //   data: <FlowManagerData>{
    //     IncommingModules: {
    //       _app: 'IoTFlow:IncommingModules',
    //       Items: this.toolkit
    //         .getNode(this.obj.ID)
    //         .getEdges()
    //         .filter(function(item) {
    //           return item.target.id === self.obj.ID;
    //         })
    //         .map(x => {
    //           let sid = '';

    //           if (
    //             x.source.data &&
    //             x.source.data &&
    //             x.source.data.Settings &&
    //             x.source.data.Settings.SchemaFlow &&
    //             x.source.data.Settings.SchemaFlow.SchemaNodes &&
    //             x.source.data.Settings.SchemaFlow.SchemaNodes.length > 0
    //           ) {
    //             const ogNodes = x.source.data.Settings.SchemaFlow.SchemaNodes.filter(function(item) {
    //               return item.Data.SchemaType === 'outgoing' && item.OutgoingModuleIDs.indexOf(self.obj.ID) > -1;
    //             });

    //             if (ogNodes.length > 0) {
    //               sid = ogNodes[0].JSONSchemaID;
    //             }
    //           }

    //           return {
    //             id: x.source.id,
    //             name: x.source.data.Text,
    //             schemaId: sid
    //           };
    //         })
    //     },
    //     ManagementPath: this.obj.ManagementPath,
    //     ManagerHeight: this.obj.ManagerHeight,
    //     ManagerWidth: this.obj.ManagerWidth,
    //     OutgoingModules: {
    //       _app: 'IoTFlow:OutgoingModules',
    //       Items: this.toolkit
    //         .getNode(this.obj.ID)
    //         .getEdges()
    //         .filter(function(item) {
    //           return item.source.id === self.obj.ID;
    //         })
    //         .map(x => {
    //           return {
    //             id: x.target.id,
    //             name: x.target.data.Text,
    //             type: x.target.data.Service,
    //             status: x.target.data.Status
    //           };
    //         })
    //     },
    //     SchemaOptions: [],
    //     Settings: this.obj.Settings || {},
    //     Token: this.token,
    //     ModuleTypeName: this.obj.Text,
    //     UnavailableLookups: [],
    //     FirstLoad: false,
    //     Service: this.obj.Service,
    //     Application: this.obj.Application,
    //     FlowID: flowId
    //   }
    // });
  }

  // 	Helpers
}
