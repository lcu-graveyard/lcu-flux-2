import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FluxAction, FluxActionEvent, FluxConfig, FluxModule, FluxModuleOption } from '@lcu-ide/lcu-flux-common';
import { Loading, Status } from '@lcu-ide/common';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  //  Properties
  public Actions: FluxAction[];

  public Modules: FluxModuleOption[];

  public Config: FluxConfig;

  public Loading: Loading;

  //  Constructors
  constructor() {
    this.Loading = new Loading();
  }

  //  Life Cycle
  public ngOnInit() {
    this.Actions = [
      {
        Action: '$relayout',
        Icon: 'swap_calls',
        Text: 'Relayout Flow'
      },
      {
        Action: 'save',
        Icon: 'sd_card',
        Text: 'Save Flow'
      },
      {
        Action: 'provision',
        Disabled: true,
        Icon: 'cloud_upload',
        Text: `Can't Provision Flow with Errors`
      },
      {
        Action: 'back',
        Icon: 'arrow_back',
        Text: 'Back to Forge'
      }
    ];

    this.Modules = [
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.DataMap',
        Catalog: 'Fathym.Core',
        Category: 'Core',
        ControlType: 'Flow',
        Description:
          'Map data stream into a specfic schema to be carried down the flow.  Setup alerts that control warnings or pausing a stream flow.',
        Height: 200.0,
        Icon: 'call_merge',
        IncomingConnectionLimit: -1,
        IncomingConnectionTypes: [],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Common.DataMapModuleManager',
        Name: 'Data Map',
        OutgoingConnectionLimit: -1,
        OutgoingConnectionTypes: [],
        Shape: 'Custom',
        Width: 200.0,
        Visible: true,
        ID: 'ffff551f-2bd6-45d9-812e-772d724a8146'
      },
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.StaticDataStreamer',
        Catalog: 'Fathym.Core',
        Category: 'Dev',
        ControlType: 'Direct',
        Description: 'Take a static data source and treat it as a live stream.',
        Height: 150.0,
        Icon: 'autorenew',
        IncomingConnectionLimit: 0,
        IncomingConnectionTypes: [],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Dev.StaticDataStreamerModuleManager',
        Name: 'Static Data Streamer',
        OutgoingConnectionLimit: -1,
        OutgoingConnectionTypes: ['Fathym.Flow.Modules.Core.Manager.Input.DataStreamModuleManager'],
        Shape: 'Ellipse',
        Width: 150.0,
        Visible: true,
        ID: 'f68ed637-4e65-4894-aa46-6e2b0ad5e4ca'
      },
    ];

    this.Config = {
      Description: 'Test Flow Expanded',
      Deleted: false,
      Lookup: 'tst2',
      Modules: [
        {
          Deleted: false,
          Left: -825,
          Top: -121,
          Settings: {
            Description: 'Salesforce Input',
            HubLookup: 'sf1',
            Lookup: 'sf1',
            _app: 'IoTFlow',
            _token: 'ac4b170f-1121-4809-9393-cca94d29faac'
          },
          Text: 'Salesforce',
          Active: true,
          Lookup: 'Fathym.IoT.Flow.Modules.Core.Fabric.DeviceStream',
          Catalog: 'Fathym.Core',
          Category: 'Input',
          ControlType: 'Gate',
          Description: 'Connect your devices through a secure IoT Hub... manage, command, analyze, and optimize.',
          Height: 200.0,
          Icon: 'wifi_tethering',
          IncomingConnectionLimit: -1,
          IncomingConnectionTypes: ['Fathym.IoT.Flow.Modules.Core.Manager.Dev.DataEmulatorModuleManager'],
          ModuleType: 'Fathym.IoT.Flow.Modules.Core.Manager.Input.DeviceStreamModuleManager',
          Name: 'Salesforce',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Rectangle',
          Width: 200.0,
          Visible: true,
          ID: '530d344c-4bab-445b-8747-a048b8289060',
          Token: null,
          Status: null
        },
        {
          Deleted: false,
          Left: -518,
          Top: 153,
          Settings: {
            Description: 'IRS Input',
            HubLookup: 'irs',
            Lookup: 'irs',
            _app: 'IoTFlow',
            _token: '04d73153-7eee-4d2f-b197-e62dda6e58fb'
          },
          Text: 'IRS',
          Active: true,
          Lookup: 'Fathym.IoT.Flow.Modules.Core.Fabric.DeviceStream',
          Catalog: 'Fathym.Core',
          Category: 'Input',
          ControlType: 'Gate',
          Description: 'Connect your devices through a secure IoT Hub... manage, command, analyze, and optimize.',
          Height: 200.0,
          Icon: 'wifi_tethering',
          IncomingConnectionLimit: -1,
          IncomingConnectionTypes: ['Fathym.IoT.Flow.Modules.Core.Manager.Dev.DataEmulatorModuleManager'],
          ModuleType: 'Fathym.IoT.Flow.Modules.Core.Manager.Input.DeviceStreamModuleManager',
          Name: 'IRS',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Circle',
          Width: 200.0,
          Visible: true,
          ID: '24bc247c-518b-4f89-9868-2752d2ebec3c',
          Token: null,
          Status: null
        }
      ].filter(mdl => {
        return ['b8c513aa-9471-439f-b70d-4fdf0b409b91', '436b0e7d-939a-4c1c-ac83-8f8a122d8ce5'].some(i => i === mdl.ID);
      }),
      Name: 'Test Flow Expanded',
      Streams: [
        {
          Description: null,
          InputModuleID: 'b8c513aa-9471-439f-b70d-4fdf0b409b91',
          Name: null,
          Order: 0,
          OutputModuleID: '436b0e7d-939a-4c1c-ac83-8f8a122d8ce5',
          Transform: null,
          ID: '00000000-0000-0000-0000-000000000000'
        },
        {
          Description: null,
          InputModuleID: 'be6039f7-6847-429a-b8be-1d34f2ce07ee',
          Name: null,
          Order: 0,
          OutputModuleID: '0ab8dce3-a1a5-43c4-9e37-bba73a77aff3',
          Transform: null,
          ID: '00000000-0000-0000-0000-000000000000'
        }
      ].slice(0, 1),
      ID: '6784ddc5-e4d1-428e-aa3c-d488696c9fb7'
    };
  }

  //  API Methods
  public Action(event: FluxActionEvent) {
    console.log(event);

    this.Loading.Set(event.Action !== '$drawer');

    setTimeout(() => {
      this.Loading.Set(false);
    }, 1250);
  }
}
