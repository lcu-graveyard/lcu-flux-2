import { Component, OnInit } from '@angular/core';
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
  public obj: FluxModule;

  public ModuleShape: any;

  protected surface: Surface;

  protected token: string;

  protected toolkit: jsPlumbToolkit;

  // 	Properties

  // 	Constructors
  constructor() {
    this.token = this.newToken();

    this.ModuleShape = '';
  }

  // 	Runtime

  public ngOnInit() {
    this.obj.Token = this.token;

    this.toolkit.updateNode(this.toolkit.getNode(this.obj.ID), this.obj);

    window.addEventListener(
      'message',
      ev => {
        const data = this.shouldHandle('IoTFlow', ev);

        if (data) {
          this.handleSettingsMessage(data);
        }
      },
      false
    );
  }

  // 	API Methods
  public Abs(input: number) {
    return Math.abs(input);
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
  protected handleSettingsMessage(settings: any) {
    this.obj.Settings = settings;

    const successObj = { confirm: true };

    // this.dialog.openDialogs.forEach(function(modal) {
    //   modal.close(successObj);
    // });

    // if (this.mgrDialog)
    //    this.mgrDialog.close(successObj);
    // else
    // {
    //    this.dialog._openDialogs.forEach(function (modal) {
    //        modal.close(successObj);
    //    });
    // }

    window.postMessage(
      {
        _type: 'SettingsUpdated',
        Settings: settings,
        NodeID: this.obj.ID
      },
      '*'
    );
  }

  protected newToken() {
    return Guid.Create().ToString();
  }

  protected shouldHandle(app: string, ev: MessageEvent) {
    try {
      const data = ev.data ? JSON.parse(ev.data) : null;

      const handle = data && data._app === app && data._token === this.token;

      return handle ? data : null;
    } catch (e) {
      return null;
    }
  }
}
