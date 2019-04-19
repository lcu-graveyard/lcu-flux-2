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
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.Filter',
        Catalog: 'Fathym.Core',
        Category: 'Core',
        ControlType: 'Flow',
        Description:
          'Filter a stream into a specfic schema to be carried down the flow.  Setup alerts that control warnings or pausing a stream flow.',
        Height: 100.0,
        Icon: 'filter_tilt_shift',
        IncomingConnectionLimit: 1,
        IncomingConnectionTypes: [],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Common.FilterModuleManager',
        Name: 'Filter',
        OutgoingConnectionLimit: 1,
        OutgoingConnectionTypes: [],
        Shape: 'Custom',
        Width: 100.0,
        Visible: false,
        ID: 'b9bfa1b4-2c3a-45c3-b717-88f0be8cd794'
      },
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.DataStream',
        Catalog: 'Fathym.Core',
        Category: 'Input',
        ControlType: 'Gate',
        Description: 'Stream your non device data through Fathym for analysis and optimization.',
        Height: 200.0,
        Icon: 'settings_input_antenna',
        IncomingConnectionLimit: -1,
        IncomingConnectionTypes: [],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Input.DataStreamModuleManager',
        Name: 'Data Stream',
        OutgoingConnectionLimit: -1,
        OutgoingConnectionTypes: [],
        Shape: 'Rectangle',
        Width: 200.0,
        Visible: true,
        ID: '046c7a7c-a064-4904-9f08-ceff73bf0892'
      },
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.QueryableStorage',
        Catalog: 'Fathym.Core',
        Category: 'Output',
        ControlType: 'Gate',
        Description: 'For highly available datasets requiring querying, aggregation, and massive scale.',
        Height: 200.0,
        Icon: 'assessment',
        IncomingConnectionLimit: -1,
        IncomingConnectionTypes: [],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Output.QueryableStorageModuleManager',
        Name: 'Queryable Storage',
        OutgoingConnectionLimit: -1,
        OutgoingConnectionTypes: [],
        Shape: 'Ellipse',
        Width: 200.0,
        Visible: true,
        ID: 'ef46124b-3958-4972-95a7-bb13d1e1386a'
      },
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.FathymServer',
        Catalog: 'Fathym.Core',
        Category: 'Output',
        ControlType: 'Gate',
        Description: 'Visualize, organize, analyze your data in unique and dynamic ways.',
        Height: 200.0,
        Icon: 'dashboard',
        IncomingConnectionLimit: -1,
        IncomingConnectionTypes: [],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Output.FathymServerModuleManager',
        Name: 'Fathym Server',
        OutgoingConnectionLimit: 0,
        OutgoingConnectionTypes: [],
        Shape: 'Ellipse',
        Width: 200.0,
        Visible: true,
        ID: '1367ee7d-2555-45bf-b1c0-9f3c639b3db7'
      },
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.DeviceStream',
        Catalog: 'Fathym.Core',
        Category: 'Input',
        ControlType: 'Gate',
        Description: 'Connect your devices through a secure IoT Hub... manage, command, analyze, and optimize.',
        Height: 200.0,
        Icon: 'wifi_tethering',
        IncomingConnectionLimit: -1,
        IncomingConnectionTypes: ['Fathym.Flow.Modules.Core.Manager.Dev.DeviceManagerModuleManager'],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Input.DeviceStreamModuleManager',
        Name: 'Device Stream',
        OutgoingConnectionLimit: -1,
        OutgoingConnectionTypes: [],
        Shape: 'Rectangle',
        Width: 200.0,
        Visible: true,
        ID: '29cb1ca8-5cb9-4b4d-bae6-99df32e56184'
      },
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.MasterData',
        Catalog: 'Fathym.Core',
        Category: 'Input',
        ControlType: 'Gate',
        Description: 'Import your organizational data stores and taxonomy to map against your data streams.',
        Height: 200.0,
        Icon: 'graphic_eq',
        IncomingConnectionLimit: -1,
        IncomingConnectionTypes: ['Fathym.Flow.Modules.Core.Manager.Dev.DeviceManagerModuleManager'],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Input.MasterDataModuleManager',
        Name: 'Master Data',
        OutgoingConnectionLimit: -1,
        OutgoingConnectionTypes: [],
        Shape: 'Rectangle',
        Width: 200.0,
        Visible: true,
        ID: '0022197c-023d-4c6a-8628-f5f446dbc5c8'
      },
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.Split',
        Catalog: 'Fathym.Core',
        Category: 'Core',
        ControlType: 'Flow',
        Description: 'Split a single input stream into multiple streams.',
        Height: 100.0,
        Icon: 'call_split',
        IncomingConnectionLimit: 1,
        IncomingConnectionTypes: [],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Common.SplitModuleManager',
        Name: 'Split',
        OutgoingConnectionLimit: -1,
        OutgoingConnectionTypes: [],
        Shape: 'Custom',
        Width: 100.0,
        Visible: false,
        ID: 'dd07a7d4-fb39-4cfb-aeec-3804388003c4'
      },
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.Merge',
        Catalog: 'Fathym.Core',
        Category: 'Core',
        ControlType: 'Flow',
        Description: 'Merge multiple input streams into a single stream.',
        Height: 100.0,
        Icon: 'call_merge',
        IncomingConnectionLimit: -1,
        IncomingConnectionTypes: [],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Common.MergeModuleManager',
        Name: 'Merge',
        OutgoingConnectionLimit: 1,
        OutgoingConnectionTypes: [],
        Shape: 'Custom',
        Width: 100.0,
        Visible: false,
        ID: 'c15b3569-f896-4248-b5c7-ff675999b62c'
      },
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.Visualizations',
        Catalog: 'Fathym.Core',
        Category: 'Output',
        ControlType: 'Gate',
        Description: 'Create rich visualizations that help your organization learn more about your devices.',
        Height: 200.0,
        Icon: 'center_focus_strong',
        IncomingConnectionLimit: -1,
        IncomingConnectionTypes: [],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Output.VisualizationsModuleManager',
        Name: 'Visualizations',
        OutgoingConnectionLimit: 0,
        OutgoingConnectionTypes: [],
        Shape: 'Rectangle',
        Width: 200.0,
        Visible: true,
        ID: 'e621149c-d8c5-42ba-9781-82a1b72cbff8'
      },
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.MachineLearning',
        Catalog: 'Fathym.Core',
        Category: 'Analytic',
        ControlType: 'Gate',
        Description: 'Learn more about your devices, in real-time and over historic data.',
        Height: 200.0,
        Icon: 'library_books',
        IncomingConnectionLimit: -1,
        IncomingConnectionTypes: [],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Analytics.MachineLearningModuleManager',
        Name: 'Machine Learning',
        OutgoingConnectionLimit: -1,
        OutgoingConnectionTypes: [],
        Shape: 'Rectangle',
        Width: 200.0,
        Visible: true,
        ID: 'f995ebe8-2c04-495d-b8a8-67241ab6cddd'
      },
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.BinaryStorage',
        Catalog: 'Fathym.Core',
        Category: 'Output',
        ControlType: 'Gate',
        Description: 'For archive/cold datasets that can be used to create richer datasets in the future.',
        Height: 200.0,
        Icon: 'assessment',
        IncomingConnectionLimit: -1,
        IncomingConnectionTypes: [],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Output.BinaryStorageModuleManager',
        Name: 'Binary Storage',
        OutgoingConnectionLimit: -1,
        OutgoingConnectionTypes: [],
        Shape: 'Ellipse',
        Width: 200.0,
        Visible: true,
        ID: '56108c75-fcef-4a06-9d07-122f6ddfbaa8'
      },
      {
        Active: true,
        Lookup: 'Fathym.Flow.Modules.Core.Fabric.DeviceManager',
        Catalog: 'Fathym.Core',
        Category: 'Dev',
        ControlType: 'Direct',
        Description: 'Configure a real-time stream of data.',
        Height: 200.0,
        Icon: 'autorenew',
        IncomingConnectionLimit: 0,
        IncomingConnectionTypes: [],
        ModuleType: 'Fathym.Flow.Modules.Core.Manager.Dev.DeviceManagerModuleManager',
        Name: 'Device Manager',
        OutgoingConnectionLimit: 1,
        OutgoingConnectionTypes: [
          'Fathym.Flow.Modules.Core.Manager.Input.DeviceStreamModuleManager',
          'Fathym.Flow.Modules.Core.Manager.Input.DataStreamModuleManager'
        ],
        Shape: 'Ellipse',
        Width: 200.0,
        Visible: true,
        ID: '6489aa80-a0c1-4840-b727-2e45d3dee81a'
      }
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
        },
        {
          Deleted: false,
          Left: -522,
          Top: 446,
          Settings: {
            Description: 'DMV Input',
            HubLookup: 'dmv',
            Lookup: 'dmv',
            _app: 'IoTFlow',
            _token: '03acf05d-63dd-4f0c-8dcd-415593cf8084'
          },
          Text: 'DMV',
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
          Name: 'DMV',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Rectangle',
          Width: 200.0,
          Visible: true,
          ID: 'b8c513aa-9471-439f-b70d-4fdf0b409b91',
          Token: null,
          Status: null
        },
        {
          Deleted: false,
          Left: -114,
          Top: -125,
          Settings: {
            Description: 'Salesforce and IRS',
            Lookup: 'sirs',
            SchemaFlow: {
              SchemaNodes: [
                {
                  ID: 'a2a03c0a-436c-4ce9-b154-26b0ecf1a34a',
                  Data: {
                    id: 'a2a03c0a-436c-4ce9-b154-26b0ecf1a34a',
                    SchemaType: 'incomming',
                    type: 'schema',
                    Name: 'IRS Input Schema',
                    Top: 14,
                    Left: -441,
                    FilterFunctionError: false,
                    Id: 'a2a03c0a-436c-4ce9-b154-26b0ecf1a34a'
                  },
                  JSONSchemaID: 'ec2acd11-c5ab-45aa-a41b-1ecb076133fc',
                  IncommingModuleID: '24bc247c-518b-4f89-9868-2752d2ebec3c',
                  OutgoingModuleIDs: [],
                  JoinRelationships: [],
                  Groups: [],
                  Timestamp: '',
                  TumblingWindow: false,
                  TumblingInterval: '',
                  TumblingIntervalValue: null,
                  DisableSchemaEdit: true
                },
                {
                  ID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  Data: {
                    id: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                    SchemaType: 'outgoing',
                    type: 'schema',
                    Name: 'Person Record',
                    Top: -141,
                    Left: 5,
                    FilterFunctionError: false,
                    JoinFunctionError: false,
                    Id: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                    GroupError: false
                  },
                  JSONSchemaID: '4eae89fe-ddb2-4d3e-9153-8ba504f6c9dc',
                  IncommingModuleID: '',
                  OutgoingModuleIDs: ['436b0e7d-939a-4c1c-ac83-8f8a122d8ce5', '596ded28-940e-4aa5-9bf6-9cd5f9046b94'],
                  JoinRelationships: [
                    {
                      Key: 'a2a03c0a-436c-4ce9-b154-26b0ecf1a34a',
                      Object: {
                        Relationship: 'main',
                        Order: 0
                      }
                    },
                    {
                      Key: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                      Object: {
                        Relationship: 'join',
                        Order: 1
                      }
                    }
                  ],
                  Groups: [
                    'cfb591bb-e2a6-4468-a521-383293c4dec2',
                    '95f6adef-ae28-49a4-ac68-fe991dee5721',
                    '69e42291-3319-413c-a7ba-9e463fb398ec',
                    'd856f341-0c2d-42d0-b360-c1cc98b8052c',
                    '9e79f2f6-215b-41c8-b6f0-3fcc0f8c2018'
                  ],
                  Timestamp: 'cfb591bb-e2a6-4468-a521-383293c4dec2',
                  TumblingWindow: true,
                  TumblingInterval: 'hours',
                  TumblingIntervalValue: 2,
                  DisableSchemaEdit: true
                },
                {
                  ID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                  Data: {
                    id: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                    SchemaType: 'incomming',
                    type: 'schema',
                    Name: 'Salesforce Input Schema',
                    Top: -176,
                    Left: -433,
                    FilterFunctionError: false
                  },
                  JSONSchemaID: '356852e8-7981-4a52-835f-294aa7e32f8c',
                  IncommingModuleID: '530d344c-4bab-445b-8747-a048b8289060',
                  OutgoingModuleIDs: [],
                  JoinRelationships: [],
                  Groups: [],
                  Timestamp: '',
                  TumblingWindow: false,
                  TumblingInterval: '',
                  TumblingIntervalValue: null,
                  DisableSchemaEdit: true
                }
              ],
              SchemaMaps: [
                {
                  ID: 'f47b43c5-b3a5-4d49-a484-e81a89a820c0',
                  IncommingSchemaID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                  OutgoingSchemaID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  Data: {
                    id: 'f47b43c5-b3a5-4d49-a484-e81a89a820c0',
                    type: 'default'
                  },
                  IncommingPropertyID: '2d04445d-c7d1-46a4-b47b-94c98594ab8f',
                  OutgoingPropertyID: 'a4e136c3-ec54-4205-a984-e32150ae00da'
                },
                {
                  ID: 'fa9046d1-2588-4b82-a17e-6ab4f131a363',
                  IncommingSchemaID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                  OutgoingSchemaID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  Data: {
                    id: 'fa9046d1-2588-4b82-a17e-6ab4f131a363',
                    type: 'default'
                  },
                  IncommingPropertyID: '84035a32-8370-427a-9069-c15d6b091097',
                  OutgoingPropertyID: '95f6adef-ae28-49a4-ac68-fe991dee5721'
                },
                {
                  ID: '2c699539-edfe-472f-a93c-af0d99dbed4e',
                  IncommingSchemaID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                  OutgoingSchemaID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  Data: {
                    id: '2c699539-edfe-472f-a93c-af0d99dbed4e',
                    type: 'default'
                  },
                  IncommingPropertyID: '40b5e7ec-5f54-4a8a-a9a2-560e01efae0c',
                  OutgoingPropertyID: '95f6adef-ae28-49a4-ac68-fe991dee5721'
                },
                {
                  ID: '58dd6fac-0d09-418c-9603-622274957772',
                  IncommingSchemaID: 'a2a03c0a-436c-4ce9-b154-26b0ecf1a34a',
                  OutgoingSchemaID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  Data: {
                    id: '58dd6fac-0d09-418c-9603-622274957772',
                    type: 'default'
                  },
                  IncommingPropertyID: '16a6bd00-37e0-4e6a-a7df-32b889efcbaf',
                  OutgoingPropertyID: '95f6adef-ae28-49a4-ac68-fe991dee5721'
                },
                {
                  ID: 'dd229aeb-aac9-49cc-8aa8-8c974e32fd48',
                  IncommingSchemaID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                  OutgoingSchemaID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  Data: {
                    id: 'dd229aeb-aac9-49cc-8aa8-8c974e32fd48',
                    type: 'default'
                  },
                  IncommingPropertyID: '16a6bd00-37e0-4e6a-a7df-32b889efcbaf',
                  OutgoingPropertyID: '69e42291-3319-413c-a7ba-9e463fb398ec'
                },
                {
                  ID: '36c6ab1f-d37d-4750-b68e-110964c849bc',
                  IncommingSchemaID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                  OutgoingSchemaID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  Data: {
                    id: '36c6ab1f-d37d-4750-b68e-110964c849bc',
                    type: 'default'
                  },
                  IncommingPropertyID: '16a6bd00-37e0-4e6a-a7df-32b889efcbaf',
                  OutgoingPropertyID: '9e79f2f6-215b-41c8-b6f0-3fcc0f8c2018'
                },
                {
                  ID: 'c734f073-4ec8-4421-832f-e8cad6259309',
                  IncommingSchemaID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                  OutgoingSchemaID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  Data: {
                    id: 'c734f073-4ec8-4421-832f-e8cad6259309',
                    type: 'default'
                  },
                  IncommingPropertyID: 'cfb591bb-e2a6-4468-a521-383293c4dcc1',
                  OutgoingPropertyID: 'd856f341-0c2d-42d0-b360-c1cc98b8052c'
                },
                {
                  ID: 'b0408c72-309d-41de-bb1e-5dc375e37d21',
                  IncommingSchemaID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                  OutgoingSchemaID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  Data: {
                    id: 'b0408c72-309d-41de-bb1e-5dc375e37d21',
                    type: 'default'
                  },
                  IncommingPropertyID: 'cfb591bb-e2a6-4468-a521-383293c4dcc2',
                  OutgoingPropertyID: 'cfb591bb-e2a6-4468-a521-383293c4dec2'
                }
              ],
              SchemaFunctions: [
                {
                  ID: 'abd2bf53-420b-4f92-b5be-a020e6ba046e',
                  Properties: [
                    {
                      id: '2d04445d-c7d1-46a4-b47b-94c98594ab8f',
                      SchemaID: '356852e8-7981-4a52-835f-294aa7e32f8c',
                      Order: 0,
                      Source: 'property',
                      NodeID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df'
                    },
                    {
                      id: 'static_integer',
                      StaticValue: '100',
                      StaticValueType: 'integer',
                      Order: 1,
                      Source: 'static'
                    }
                  ],
                  Name: 'SF ID >=100',
                  Order: 0,
                  FunctionID: 'b3e56e96-80de-431d-933f-243c2cc2c2c2',
                  ExtraData: {
                    Refactored: false,
                    HasErrors: false
                  },
                  ResultNodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  ResultPropertyID: '',
                  ReturnValueType: null,
                  ReturnTrueSourceID: null,
                  ReturnTrueSource: 'self',
                  ReturnTrueValue: null,
                  ReturnFalseSourceID: null,
                  ReturnFalseSource: 'self',
                  ReturnFalseValue: null,
                  Type: 'filter'
                },
                {
                  ID: '1c0cf4de-d548-4e53-9aa8-84bb00e2e860',
                  Properties: [
                    {
                      id: 'cfb591bb-e2a6-4468-a521-383293c4dcc1',
                      SchemaID: '356852e8-7981-4a52-835f-294aa7e32f8c',
                      NodeID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                      Order: 0,
                      Source: 'property'
                    },
                    {
                      id: 'cfb591bb-e2a6-4468-a521-383293c4dcc1',
                      SchemaID: 'ec2acd11-c5ab-45aa-a41b-1ecb076133fc',
                      NodeID: 'a2a03c0a-436c-4ce9-b154-26b0ecf1a34a',
                      Order: 1,
                      Source: 'property'
                    }
                  ],
                  Name: 'SF IRS Join',
                  Order: 0,
                  FunctionID: 'b3e56e96-80de-431d-933f-243c2cc2c2c5',
                  ExtraData: {
                    Refactored: false,
                    HasErrors: false
                  },
                  ResultNodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  ResultPropertyID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                  ReturnValueType: null,
                  ReturnTrueSourceID: null,
                  ReturnTrueSource: 'self',
                  ReturnTrueValue: null,
                  ReturnFalseSourceID: null,
                  ReturnFalseSource: 'self',
                  ReturnFalseValue: null,
                  Type: 'join'
                },
                {
                  ID: '3d8450ac-24cb-40bc-a8cc-20e503fcbec0',
                  Properties: [
                    {
                      id: '2d04445d-c7d1-46a4-b47b-94c98594ab8f',
                      SchemaID: '356852e8-7981-4a52-835f-294aa7e32f8c',
                      NodeID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                      Order: 0,
                      Source: 'property'
                    }
                  ],
                  Name: 'count',
                  Order: 0,
                  FunctionID: 'b3e56e96-80de-531d-933f-643c2cc2c9e6',
                  ExtraData: {
                    Refactored: false,
                    HasErrors: false
                  },
                  ResultNodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  ResultPropertyID: 'a4e136c3-ec54-4205-a984-e32150ae00da',
                  ReturnValueType: null,
                  ReturnTrueSourceID: null,
                  ReturnTrueSource: 'self',
                  ReturnTrueValue: null,
                  ReturnFalseSourceID: null,
                  ReturnFalseSource: 'self',
                  ReturnFalseValue: null,
                  Type: 'mapping'
                },
                {
                  ID: 'e0349e74-1197-41a0-b4e9-26743d80a65d',
                  Properties: [
                    {
                      id: '3d8450ac-24cb-40bc-a8cc-20e503fcbec0',
                      Order: 0,
                      Source: 'function'
                    }
                  ],
                  Name: 'sbsr',
                  Order: 1,
                  FunctionID: 'b3e56e96-80de-431d-933f-243c2cc2c5c6',
                  ExtraData: {
                    Refactored: false,
                    HasErrors: false
                  },
                  ResultNodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  ResultPropertyID: 'a4e136c3-ec54-4205-a984-e32150ae00da',
                  ReturnValueType: null,
                  ReturnTrueSourceID: null,
                  ReturnTrueSource: 'self',
                  ReturnTrueValue: null,
                  ReturnFalseSourceID: null,
                  ReturnFalseSource: 'self',
                  ReturnFalseValue: null,
                  Type: 'mapping'
                },
                {
                  ID: '718991dc-1067-4062-b6e9-b3f597346fc5',
                  Properties: [
                    {
                      id: '84035a32-8370-427a-9069-c15d6b091097',
                      SchemaID: '356852e8-7981-4a52-835f-294aa7e32f8c',
                      NodeID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                      Order: 0,
                      Source: 'property'
                    },
                    {
                      id: 'static_string',
                      StaticValue: ' ',
                      StaticValueType: 'string',
                      Order: 1,
                      Source: 'static'
                    },
                    {
                      id: '16a6bd00-37e0-4e6a-a7df-32b889efcbaf',
                      SchemaID: 'ec2acd11-c5ab-45aa-a41b-1ecb076133fc',
                      NodeID: 'a2a03c0a-436c-4ce9-b154-26b0ecf1a34a',
                      Order: 2,
                      Source: 'property'
                    },
                    {
                      id: 'static_string',
                      StaticValue: '. ',
                      StaticValueType: 'string',
                      Order: 3,
                      Source: 'static'
                    },
                    {
                      id: '40b5e7ec-5f54-4a8a-a9a2-560e01efae0c',
                      SchemaID: '356852e8-7981-4a52-835f-294aa7e32f8c',
                      NodeID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                      Order: 4,
                      Source: 'property'
                    }
                  ],
                  Name: 'Compute Full Name',
                  Order: 0,
                  FunctionID: 'b3e56e96-80de-431d-933f-243c2cc2c2b8',
                  ExtraData: {
                    Refactored: false,
                    HasErrors: false
                  },
                  ResultNodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  ResultPropertyID: '95f6adef-ae28-49a4-ac68-fe991dee5721',
                  ReturnValueType: null,
                  ReturnTrueSourceID: null,
                  ReturnTrueSource: 'self',
                  ReturnTrueValue: null,
                  ReturnFalseSourceID: null,
                  ReturnFalseSource: 'self',
                  ReturnFalseValue: null,
                  Type: 'mapping'
                },
                {
                  ID: '9339ff86-a11b-415c-a2be-8a91bb70eeb0',
                  Properties: [
                    {
                      id: '16a6bd00-37e0-4e6a-a7df-32b889efcbaf',
                      SchemaID: '356852e8-7981-4a52-835f-294aa7e32f8c',
                      NodeID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df',
                      Order: 0,
                      Source: 'property'
                    },
                    {
                      id: 'static_integer',
                      StaticValue: '18',
                      StaticValueType: 'integer',
                      Order: 1,
                      Source: 'static'
                    }
                  ],
                  Name: 'Compute IsAdult',
                  Order: 0,
                  FunctionID: 'b3e56e96-80de-431d-933f-243c2cc2c2c2',
                  ExtraData: {
                    Refactored: false,
                    HasErrors: false
                  },
                  ResultNodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  ResultPropertyID: '69e42291-3319-413c-a7ba-9e463fb398ec',
                  ReturnValueType: 'boolean',
                  ReturnTrueSourceID: 'static_true',
                  ReturnTrueSource: 'static',
                  ReturnTrueValue: '1',
                  ReturnFalseSourceID: 'static_false',
                  ReturnFalseSource: 'static',
                  ReturnFalseValue: '0',
                  Type: 'mapping'
                },
                {
                  ID: 'a61b9d75-7d73-4612-ab6e-3fffc744aa7b',
                  Properties: [
                    {
                      id: '9339ff86-a11b-415c-a2be-8a91bb70eeb0',
                      Order: 0,
                      Source: 'function'
                    },
                    {
                      id: 'static_true',
                      StaticValue: '1',
                      StaticValueType: 'boolean',
                      Order: 1,
                      Source: 'static'
                    }
                  ],
                  Name: 'Compute Salutation',
                  Order: 0,
                  FunctionID: 'b3e56e96-80de-431d-933f-243c2cc2c2c5',
                  ExtraData: {
                    Refactored: false,
                    HasErrors: false
                  },
                  ResultNodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  ResultPropertyID: '9e79f2f6-215b-41c8-b6f0-3fcc0f8c2018',
                  ReturnValueType: 'string',
                  ReturnTrueSourceID: 'static_string',
                  ReturnTrueSource: 'static',
                  ReturnTrueValue: 'Dear',
                  ReturnFalseSourceID: 'static_string',
                  ReturnFalseSource: 'static',
                  ReturnFalseValue: 'Hey',
                  Type: 'mapping'
                }
              ],
              SchemaFunctionReturns: [
                {
                  PropertyID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  NodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  SchemaFunctionsReturnSource: 'function',
                  SchemaFunctionsReturnSourceID: 'abd2bf53-420b-4f92-b5be-a020e6ba046e',
                  SchemaFunctionsReturnValue: null,
                  SchemaFunctionsReturnValueType: null,
                  Type: 'filter',
                  ExternalSchemaID: ''
                },
                {
                  PropertyID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  NodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  SchemaFunctionsReturnSource: 'function',
                  SchemaFunctionsReturnSourceID: '1c0cf4de-d548-4e53-9aa8-84bb00e2e860',
                  SchemaFunctionsReturnValue: null,
                  SchemaFunctionsReturnValueType: null,
                  Type: 'join',
                  ExternalSchemaID: '89e4e40b-46f1-4fdc-b568-d8aa6c87e1df'
                },
                {
                  PropertyID: 'a4e136c3-ec54-4205-a984-e32150ae00da',
                  NodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  SchemaFunctionsReturnSource: 'function',
                  SchemaFunctionsReturnSourceID: 'e0349e74-1197-41a0-b4e9-26743d80a65d',
                  SchemaFunctionsReturnValue: null,
                  SchemaFunctionsReturnValueType: null,
                  Type: 'mapping',
                  ExternalSchemaID: ''
                },
                {
                  PropertyID: '95f6adef-ae28-49a4-ac68-fe991dee5721',
                  NodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  SchemaFunctionsReturnSource: 'function',
                  SchemaFunctionsReturnSourceID: '718991dc-1067-4062-b6e9-b3f597346fc5',
                  SchemaFunctionsReturnValue: null,
                  SchemaFunctionsReturnValueType: null,
                  Type: 'mapping',
                  ExternalSchemaID: ''
                },
                {
                  PropertyID: '69e42291-3319-413c-a7ba-9e463fb398ec',
                  NodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  SchemaFunctionsReturnSource: 'function',
                  SchemaFunctionsReturnSourceID: '9339ff86-a11b-415c-a2be-8a91bb70eeb0',
                  SchemaFunctionsReturnValue: null,
                  SchemaFunctionsReturnValueType: null,
                  Type: 'mapping',
                  ExternalSchemaID: ''
                },
                {
                  PropertyID: '9e79f2f6-215b-41c8-b6f0-3fcc0f8c2018',
                  NodeID: 'a89d733f-63f9-4497-b226-f1a83c08d50e',
                  SchemaFunctionsReturnSource: 'function',
                  SchemaFunctionsReturnSourceID: 'a61b9d75-7d73-4612-ab6e-3fffc744aa7b',
                  SchemaFunctionsReturnValue: null,
                  SchemaFunctionsReturnValueType: null,
                  Type: 'mapping',
                  ExternalSchemaID: ''
                }
              ]
            },
            HasErrors: false,
            _app: 'IoTFlow',
            _token: '3d633b02-3631-4595-b7c8-290c83e5e8bd',
            Inputs: null,
            Query:
              'WITH [CTE_Person Record] AS ( SELECT TRY_CAST(COUNT([sf1].[ID]) AS int) AS [Salesforce ID],CONCAT([sf1].[FirstName],\' \',[irs].[MiddleInitial],\'. \',[sf1].[LastName]) AS [FullName],CASE WHEN [sf1].[Age] >= 18 THEN 1 ELSE 0 END AS [IsAdult],CASE WHEN CASE WHEN [sf1].[Age] >= 18 THEN 1 ELSE 0 END = 1 THEN \'Dear\' ELSE \'Hey\' END AS [Salutation],[sf1].[SSN] AS [SSN],[sf1].[EventTime] AS [EventTime] FROM [irs] AS [irs] TIMESTAMP BY [sf1].[EventTime] JOIN [sf1] AS [sf1] ON [sf1].[SSN] = [irs].[SSN] GROUP BY  TUMBLINGWINDOW( hours,2),CONCAT([sf1].[FirstName],\' \',[irs].[MiddleInitial],\'. \',[sf1].[LastName]),CASE WHEN [sf1].[Age] >= 18 THEN 1 ELSE 0 END,CASE WHEN CASE WHEN [sf1].[Age] >= 18 THEN 1 ELSE 0 END = 1 THEN \'Dear\' ELSE \'Hey\' END,[sf1].[SSN],[sf1].[EventTime]  HAVING [sf1].[ID] >= 100),\r\r\r [CTE_Client Record] AS ( SELECT [sirs].[Salesforce ID] AS [Salesforce ID],[sirs].[FullName] AS [FullName],[sirs].[IsAdult] AS [IsAdult],[sirs].[Salutation] AS [Salutation],[dmv].[Gender] AS [Gender],[sirs].[SSN] AS [SSN],[sirs].[EventTime] AS [EventTime] FROM [CTE_Person Record] AS [sirs] TIMESTAMP BY [sirs].[EventTime] JOIN [dmv] AS [dmv] ON [CTE_Person Record].[SSN] = [dmv].[SSN] WHERE [CTE_Person Record].[Salesforce ID] >= 600)\r\r\rSELECT * INTO [fblb] FROM [CTE_Person Record];\r\r\rSELECT * INTO [cblb] FROM [CTE_Client Record];\r\r\rSELECT [+dmv].[Salesforce ID] AS [Salesforce ID],[+dmv].[FullName] AS [FullName],[+dmv].[IsAdult] AS [IsAdult],[+dmv].[Salutation] AS [Salutation],[+dmv].[Gender] AS [Gender],[ae1].[Eye Color] AS [Eye Color] INTO [btst]  FROM [CTE_Client Record] AS [+DMV] JOIN [ae1] AS [ae1] ON [CTE_Client Record].[SSN] = [ae1].[SSN] WHERE [CTE_Client Record].[Salesforce ID] >= 700;\r\r\r',
            Outputs: null,
            DataMapInputs: [
              {
                ID: '24bc247c-518b-4f89-9868-2752d2ebec3c',
                GateType: 'Gate',
                Lookup: 'irs',
                Name: 'irs',
                Settings:
                  '{\r\n  "Description": "IRS Input",\r\n  "HubLookup": "irs",\r\n  "Lookup": "irs",\r\n  "_app": "IoTFlow",\r\n  "_token": "04d73153-7eee-4d2f-b197-e62dda6e58fb"\r\n}',
                Type: 'DeviceStream'
              },
              {
                ID: '530d344c-4bab-445b-8747-a048b8289060',
                GateType: 'Gate',
                Lookup: 'sf1',
                Name: 'sf1',
                Settings:
                  '{\r\n  "Description": "Salesforce Input",\r\n  "HubLookup": "sf1",\r\n  "Lookup": "sf1",\r\n  "_app": "IoTFlow",\r\n  "_token": "ac4b170f-1121-4809-9393-cca94d29faac"\r\n}',
                Type: 'DeviceStream'
              },
              {
                ID: 'b8c513aa-9471-439f-b70d-4fdf0b409b91',
                GateType: 'Gate',
                Lookup: 'dmv',
                Name: 'dmv',
                Settings:
                  '{\r\n  "Description": "DMV Input",\r\n  "HubLookup": "dmv",\r\n  "Lookup": "dmv",\r\n  "_app": "IoTFlow",\r\n  "_token": "03acf05d-63dd-4f0c-8dcd-415593cf8084"\r\n}',
                Type: 'DeviceStream'
              },
              {
                ID: '0ab8dce3-a1a5-43c4-9e37-bba73a77aff3',
                GateType: 'Gate',
                Lookup: 'ae1',
                Name: 'ae1',
                Settings:
                  '{\r\n  "AutoInflate": true,\r\n  "MaxThroughputUnits": 1,\r\n  "MessageRetentionDays": 7,\r\n  "PartitionCount": 32,\r\n  "CaptureByteLimit": 10485760,\r\n  "CaptureIntervalSeconds": 60,\r\n  "Description": "affefa",\r\n  "HubLookup": "ae1",\r\n  "Lookup": "ae1",\r\n  "_app": "IoTFlow",\r\n  "_token": "4fecd4ce-683a-4e14-8834-4c2276b2f023",\r\n  "Inputs": null,\r\n  "Query": null,\r\n  "Outputs": null,\r\n  "DataMapInputs": null,\r\n  "DataMapOutputs": null,\r\n  "ASALookup": null\r\n}',
                Type: 'DataStream'
              }
            ],
            DataMapOutputs: [
              {
                ID: '596ded28-940e-4aa5-9bf6-9cd5f9046b94',
                GateType: 'Gate',
                Lookup: 'fblb',
                Name: 'fblb',
                Settings:
                  '{\r\n  "ContainerType": "Blob",\r\n  "Description": "Fathym Blob",\r\n  "ContainerName": "fblb",\r\n  "Lookup": "fblb",\r\n  "_app": "IoTFlow",\r\n  "_token": "9c39b7b5-1ca5-46c5-92c3-660a0ccabeaf"\r\n}',
                Type: 'BinaryStorage'
              },
              {
                ID: '91223260-a98d-42df-a906-b737cbb0f17d',
                GateType: 'Gate',
                Lookup: 'cblb',
                Name: 'cblb',
                Settings:
                  '{\r\n  "ContainerType": "Blob",\r\n  "Description": "Client Blob",\r\n  "ContainerName": "cblb",\r\n  "Lookup": "cblb",\r\n  "_app": "IoTFlow",\r\n  "_token": "11d80541-769c-4bc1-9d49-21040b3f2846"\r\n}',
                Type: 'BinaryStorage'
              },
              {
                ID: 'c2818c67-c595-4f4a-8e1f-df381f441d1e',
                GateType: 'Gate',
                Lookup: 'btst',
                Name: 'btst',
                Settings:
                  '{\r\n  "ContainerType": "Blob",\r\n  "Description": "btest",\r\n  "ContainerName": "btst",\r\n  "Lookup": "btst",\r\n  "_app": "IoTFlow",\r\n  "_token": "adcb494e-5439-4ddf-ab0f-36e20c9dc59a"\r\n}',
                Type: 'BinaryStorage'
              }
            ],
            ASALookup: 'DM2'
          },
          Text: 'Salesforce IRS Data Map',
          Active: true,
          Lookup: 'Fathym.IoT.Flow.Modules.Core.Fabric.DataMap',
          Catalog: 'Fathym.Core',
          Category: 'Core',
          ControlType: 'Flow',
          Description:
            'Map data stream into a specfic schema to be carried down the flow.  Setup alerts that control warnings or pausing a stream flow.',
          Height: 200.0,
          Icon: 'call_merge',
          IncomingConnectionLimit: -1,
          IncomingConnectionTypes: [],
          ModuleType: 'Fathym.IoT.Flow.Modules.Core.Manager.Common.DataMapModuleManager',
          Name: 'DM1',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Custom',
          Width: 200.0,
          Visible: true,
          ID: '28fc9aa6-f572-480a-bd95-3f6be6c83a9e',
          Token: null,
          Status: null
        },
        {
          Deleted: false,
          Left: 290,
          Top: -151,
          Settings: {
            ContainerType: 'Blob',
            Description: 'Fathym Blob',
            ContainerName: 'fblb',
            Lookup: 'fblb',
            _app: 'IoTFlow',
            _token: '9c39b7b5-1ca5-46c5-92c3-660a0ccabeaf'
          },
          Text: 'Fathym Blob',
          Active: true,
          Lookup: 'Fathym.IoT.Flow.Modules.Core.Fabric.BinaryStorage',
          Catalog: 'Fathym.Core',
          Category: 'Output',
          ControlType: 'Gate',
          Description: 'For archive/cold datasets that can be used to create richer datasets in the future.',
          Height: 200.0,
          Icon: 'assessment',
          IncomingConnectionLimit: -1,
          IncomingConnectionTypes: [],
          ModuleType: 'Fathym.IoT.Flow.Modules.Core.Manager.Output.BinaryStorageModuleManager',
          Name: 'Fathym Blob',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Ellipse',
          Width: 200.0,
          Visible: true,
          ID: '596ded28-940e-4aa5-9bf6-9cd5f9046b94',
          Token: null,
          Status: null
        },
        {
          Deleted: false,
          Left: 291,
          Top: 124,
          Settings: {
            ContainerType: 'Blob',
            Description: 'Client Blob',
            ContainerName: 'cblb',
            Lookup: 'cblb',
            _app: 'IoTFlow',
            _token: '11d80541-769c-4bc1-9d49-21040b3f2846'
          },
          Text: 'Client Blob',
          Active: true,
          Lookup: 'Fathym.IoT.Flow.Modules.Core.Fabric.BinaryStorage',
          Catalog: 'Fathym.Core',
          Category: 'Output',
          ControlType: 'Gate',
          Description: 'For archive/cold datasets that can be used to create richer datasets in the future.',
          Height: 200.0,
          Icon: 'assessment',
          IncomingConnectionLimit: -1,
          IncomingConnectionTypes: [],
          ModuleType: 'Fathym.IoT.Flow.Modules.Core.Manager.Output.BinaryStorageModuleManager',
          Name: 'Client Blob',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Ellipse',
          Width: 200.0,
          Visible: true,
          ID: '91223260-a98d-42df-a906-b737cbb0f17d',
          Token: null,
          Status: null
        },
        {
          Deleted: false,
          Left: 302,
          Top: 437,
          Settings: {
            ContainerType: 'Blob',
            Description: 'btest',
            ContainerName: 'btst',
            Lookup: 'btst',
            _app: 'IoTFlow',
            _token: 'adcb494e-5439-4ddf-ab0f-36e20c9dc59a'
          },
          Text: 'btest',
          Active: true,
          Lookup: 'Fathym.IoT.Flow.Modules.Core.Fabric.BinaryStorage',
          Catalog: 'Fathym.Core',
          Category: 'Output',
          ControlType: 'Gate',
          Description: 'For archive/cold datasets that can be used to create richer datasets in the future.',
          Height: 200.0,
          Icon: 'assessment',
          IncomingConnectionLimit: -1,
          IncomingConnectionTypes: [],
          ModuleType: 'Fathym.IoT.Flow.Modules.Core.Manager.Output.BinaryStorageModuleManager',
          Name: 'btest',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Ellipse',
          Width: 200.0,
          Visible: true,
          ID: 'c2818c67-c595-4f4a-8e1f-df381f441d1e',
          Token: null,
          Status: null
        },
        {
          Deleted: false,
          Left: -116,
          Top: 272,
          Settings: {
            Description: '+DMV',
            Lookup: '+dmv',
            SchemaFlow: {
              SchemaNodes: [
                {
                  ID: '7cc17f2c-e52c-4cdd-966a-71b61ff69d7d',
                  Data: {
                    id: '7cc17f2c-e52c-4cdd-966a-71b61ff69d7d',
                    SchemaType: 'incomming',
                    type: 'schema',
                    Name: 'DMV Input Schema',
                    Top: 230,
                    Left: -386,
                    FilterFunctionError: false,
                    JoinFunctionError: false
                  },
                  JSONSchemaID: 'b5ba0c31-9cec-46a8-bca6-d2004c881967',
                  IncommingModuleID: 'b8c513aa-9471-439f-b70d-4fdf0b409b91',
                  OutgoingModuleIDs: [],
                  JoinRelationships: [],
                  Groups: [],
                  Timestamp: '',
                  TumblingWindow: false,
                  TumblingInterval: '',
                  TumblingIntervalValue: null,
                  DisableSchemaEdit: true
                },
                {
                  ID: 'fefc2060-90a2-4494-8596-59ae5bc7c636',
                  Data: {
                    id: 'fefc2060-90a2-4494-8596-59ae5bc7c636',
                    SchemaType: 'incomming',
                    type: 'schema',
                    Name: 'Client Data',
                    Top: 430,
                    Left: -386,
                    FilterFunctionError: false
                  },
                  JSONSchemaID: '4eae89fe-ddb2-4d3e-9153-8ba504f6c9dc',
                  IncommingModuleID: '28fc9aa6-f572-480a-bd95-3f6be6c83a9e',
                  OutgoingModuleIDs: [],
                  JoinRelationships: [],
                  Groups: [],
                  Timestamp: '',
                  TumblingWindow: false,
                  TumblingInterval: '',
                  TumblingIntervalValue: null,
                  DisableSchemaEdit: true
                },
                {
                  ID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  Data: {
                    id: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                    SchemaType: 'outgoing',
                    type: 'schema',
                    Name: 'Client Record',
                    Top: 298,
                    Left: 41,
                    Id: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                    FilterFunctionError: false,
                    JoinFunctionError: false,
                    GroupError: false
                  },
                  JSONSchemaID: '81153ec2-ea53-4914-8fd5-f33c21776384',
                  IncommingModuleID: '',
                  OutgoingModuleIDs: ['91223260-a98d-42df-a906-b737cbb0f17d', 'a0fa019c-4aa8-4a04-bb04-97f41007d639'],
                  JoinRelationships: [
                    {
                      Key: '7cc17f2c-e52c-4cdd-966a-71b61ff69d7d',
                      Object: {
                        Relationship: 'join',
                        Order: 1
                      }
                    },
                    {
                      Key: 'fefc2060-90a2-4494-8596-59ae5bc7c636',
                      Object: {
                        Relationship: 'main',
                        Order: 0
                      }
                    }
                  ],
                  Groups: [],
                  Timestamp: 'd856f341-0c2d-42d0-b360-c1cc98b8052d',
                  TumblingWindow: false,
                  TumblingInterval: '',
                  TumblingIntervalValue: null,
                  DisableSchemaEdit: false
                }
              ],
              SchemaMaps: [
                {
                  ID: '065e036c-486a-4dfd-aef1-5fffbd5eb029',
                  IncommingSchemaID: 'fefc2060-90a2-4494-8596-59ae5bc7c636',
                  OutgoingSchemaID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  Data: {
                    id: '065e036c-486a-4dfd-aef1-5fffbd5eb029',
                    type: 'default'
                  },
                  IncommingPropertyID: 'a4e136c3-ec54-4205-a984-e32150ae00da',
                  OutgoingPropertyID: 'a4e136c3-ec54-4205-a984-e32150ae00da'
                },
                {
                  ID: '995d851f-2c1e-4fbd-b7d5-a6ea61178065',
                  IncommingSchemaID: 'fefc2060-90a2-4494-8596-59ae5bc7c636',
                  OutgoingSchemaID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  Data: {
                    id: '995d851f-2c1e-4fbd-b7d5-a6ea61178065',
                    type: 'default'
                  },
                  IncommingPropertyID: '95f6adef-ae28-49a4-ac68-fe991dee5721',
                  OutgoingPropertyID: '95f6adef-ae28-49a4-ac68-fe991dee5721'
                },
                {
                  ID: '88207259-5624-42ce-82d8-5d166114a087',
                  IncommingSchemaID: 'fefc2060-90a2-4494-8596-59ae5bc7c636',
                  OutgoingSchemaID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  Data: {
                    id: '88207259-5624-42ce-82d8-5d166114a087',
                    type: 'default'
                  },
                  IncommingPropertyID: '69e42291-3319-413c-a7ba-9e463fb398ec',
                  OutgoingPropertyID: '69e42291-3319-413c-a7ba-9e463fb398ec'
                },
                {
                  ID: '84e5269e-46f2-4c5e-91e8-dacd2a13d87c',
                  IncommingSchemaID: 'fefc2060-90a2-4494-8596-59ae5bc7c636',
                  OutgoingSchemaID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  Data: {
                    id: '84e5269e-46f2-4c5e-91e8-dacd2a13d87c',
                    type: 'default'
                  },
                  IncommingPropertyID: '9e79f2f6-215b-41c8-b6f0-3fcc0f8c2018',
                  OutgoingPropertyID: '9e79f2f6-215b-41c8-b6f0-3fcc0f8c2018'
                },
                {
                  ID: 'b79458f7-8a6e-4235-9d3c-6988262d44a5',
                  IncommingSchemaID: '7cc17f2c-e52c-4cdd-966a-71b61ff69d7d',
                  OutgoingSchemaID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  Data: {
                    id: 'b79458f7-8a6e-4235-9d3c-6988262d44a5',
                    type: 'default'
                  },
                  IncommingPropertyID: '79595dac-2326-494e-901b-810653fbd519',
                  OutgoingPropertyID: '94bdbde0-2ad4-4938-b942-1bbbab686227'
                },
                {
                  ID: 'c5445b81-1f05-482a-8132-349e664cf9c2',
                  IncommingSchemaID: 'fefc2060-90a2-4494-8596-59ae5bc7c636',
                  OutgoingSchemaID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  Data: {
                    id: 'c5445b81-1f05-482a-8132-349e664cf9c2',
                    type: 'default'
                  },
                  IncommingPropertyID: 'd856f341-0c2d-42d0-b360-c1cc98b8052c',
                  OutgoingPropertyID: 'd856f341-0c2d-42d0-b360-c1cc98b8052c'
                },
                {
                  ID: 'e7525f36-4801-43a4-bb7f-e92b9c216328',
                  IncommingSchemaID: 'fefc2060-90a2-4494-8596-59ae5bc7c636',
                  OutgoingSchemaID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  Data: {
                    id: 'e7525f36-4801-43a4-bb7f-e92b9c216328',
                    type: 'default'
                  },
                  IncommingPropertyID: 'cfb591bb-e2a6-4468-a521-383293c4dec2',
                  OutgoingPropertyID: 'd856f341-0c2d-42d0-b360-c1cc98b8052d'
                }
              ],
              SchemaFunctions: [
                {
                  ID: '1e580f2d-ad82-48dd-a4a1-51d80e29313b',
                  Properties: [
                    {
                      id: 'a4e136c3-ec54-4205-a984-e32150ae00da',
                      SchemaID: '4eae89fe-ddb2-4d3e-9153-8ba504f6c9dc',
                      Order: 0,
                      Source: 'property',
                      NodeID: 'fefc2060-90a2-4494-8596-59ae5bc7c636'
                    },
                    {
                      id: 'static_integer',
                      StaticValue: '600',
                      StaticValueType: 'integer',
                      Order: 1,
                      Source: 'static'
                    }
                  ],
                  Name: 'SF ID >= 600',
                  Order: 0,
                  FunctionID: 'b3e56e96-80de-431d-933f-243c2cc2c2c2',
                  ExtraData: {
                    Refactored: false,
                    HasErrors: false
                  },
                  ResultNodeID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  ResultPropertyID: '',
                  ReturnValueType: null,
                  ReturnTrueSourceID: null,
                  ReturnTrueSource: 'self',
                  ReturnTrueValue: null,
                  ReturnFalseSourceID: null,
                  ReturnFalseSource: 'self',
                  ReturnFalseValue: null,
                  Type: 'filter'
                },
                {
                  ID: '736561eb-e940-4105-9579-6b954cf9d17e',
                  Properties: [
                    {
                      id: 'd856f341-0c2d-42d0-b360-c1cc98b8052c',
                      SchemaID: '4eae89fe-ddb2-4d3e-9153-8ba504f6c9dc',
                      NodeID: 'fefc2060-90a2-4494-8596-59ae5bc7c636',
                      Order: 0,
                      Source: 'property'
                    },
                    {
                      id: 'bde53352-e9a2-4683-9dd9-2618a8249acb',
                      SchemaID: 'b5ba0c31-9cec-46a8-bca6-d2004c881967',
                      NodeID: '7cc17f2c-e52c-4cdd-966a-71b61ff69d7d',
                      Order: 1,
                      Source: 'property'
                    }
                  ],
                  Name: 'DMV Join',
                  Order: 0,
                  FunctionID: 'b3e56e96-80de-431d-933f-243c2cc2c2c5',
                  ExtraData: {
                    Refactored: false,
                    HasErrors: false
                  },
                  ResultNodeID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  ResultPropertyID: '7cc17f2c-e52c-4cdd-966a-71b61ff69d7d',
                  ReturnValueType: null,
                  ReturnTrueSourceID: null,
                  ReturnTrueSource: 'self',
                  ReturnTrueValue: null,
                  ReturnFalseSourceID: null,
                  ReturnFalseSource: 'self',
                  ReturnFalseValue: null,
                  Type: 'join'
                }
              ],
              SchemaFunctionReturns: [
                {
                  PropertyID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  NodeID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  SchemaFunctionsReturnSource: 'function',
                  SchemaFunctionsReturnSourceID: '1e580f2d-ad82-48dd-a4a1-51d80e29313b',
                  SchemaFunctionsReturnValue: null,
                  SchemaFunctionsReturnValueType: null,
                  Type: 'filter',
                  ExternalSchemaID: ''
                },
                {
                  PropertyID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  NodeID: 'f09e9a3b-de52-46b7-8834-cc6780d61d02',
                  SchemaFunctionsReturnSource: 'function',
                  SchemaFunctionsReturnSourceID: '736561eb-e940-4105-9579-6b954cf9d17e',
                  SchemaFunctionsReturnValue: null,
                  SchemaFunctionsReturnValueType: null,
                  Type: 'join',
                  ExternalSchemaID: '7cc17f2c-e52c-4cdd-966a-71b61ff69d7d'
                }
              ]
            },
            HasErrors: false,
            _app: 'IoTFlow',
            _token: '132a7c01-2ddd-49dd-a231-5c105bf1ecb7'
          },
          Text: '+DMV',
          Active: true,
          Lookup: 'Fathym.IoT.Flow.Modules.Core.Fabric.DataMap',
          Catalog: 'Fathym.Core',
          Category: 'Core',
          ControlType: 'Flow',
          Description:
            'Map data stream into a specfic schema to be carried down the flow.  Setup alerts that control warnings or pausing a stream flow.',
          Height: 200.0,
          Icon: 'call_merge',
          IncomingConnectionLimit: -1,
          IncomingConnectionTypes: [],
          ModuleType: 'Fathym.IoT.Flow.Modules.Core.Manager.Common.DataMapModuleManager',
          Name: '+DMV',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Custom',
          Width: 200.0,
          Visible: true,
          ID: '436b0e7d-939a-4c1c-ac83-8f8a122d8ce5',
          Token: null,
          Status: null
        },
        {
          Deleted: false,
          Left: -992,
          Top: 722,
          Settings: {
            Description: 'bbbb',
            HubLookup: 'bbb',
            Lookup: 'bbb',
            _app: 'IoTFlow',
            _token: '5c8c016e-72a0-41df-a422-9f52ce160bef'
          },
          Text: 'bbbb',
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
          Name: 'bbbb',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Rectangle',
          Width: 200.0,
          Visible: true,
          ID: 'be6039f7-6847-429a-b8be-1d34f2ce07ee',
          Token: null,
          Status: null
        },
        {
          Deleted: false,
          Left: -526,
          Top: 728,
          Settings: {
            AutoInflate: true,
            MaxThroughputUnits: 1,
            MessageRetentionDays: 7,
            PartitionCount: 32,
            CaptureByteLimit: 10485760,
            CaptureIntervalSeconds: 60,
            Description: 'affefa',
            HubLookup: 'ae1',
            Lookup: 'ae1',
            _app: 'IoTFlow',
            _token: '4fecd4ce-683a-4e14-8834-4c2276b2f023',
            Inputs: null,
            Query: null,
            Outputs: null,
            DataMapInputs: null,
            DataMapOutputs: null,
            ASALookup: null
          },
          Text: 'akflke',
          Active: true,
          Lookup: 'Fathym.IoT.Flow.Modules.Core.Fabric.DataStream',
          Catalog: 'Fathym.Core',
          Category: 'Input',
          ControlType: 'Gate',
          Description: 'Stream your non device data through Fathym for analysis and optimization.',
          Height: 200.0,
          Icon: 'settings_input_antenna',
          IncomingConnectionLimit: -1,
          IncomingConnectionTypes: [],
          ModuleType: 'Fathym.IoT.Flow.Modules.Core.Manager.Input.DataStreamModuleManager',
          Name: 'akflke',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Rectangle',
          Width: 200.0,
          Visible: true,
          ID: '0ab8dce3-a1a5-43c4-9e37-bba73a77aff3',
          Token: null,
          Status: null
        },
        {
          Deleted: false,
          Left: -141,
          Top: 656,
          Settings: {
            Description: 'dm1',
            Lookup: 'dm1',
            SchemaFlow: {
              SchemaNodes: [
                {
                  ID: '101180e5-3316-4d9c-92f4-881e4d3bd626',
                  Data: {
                    id: '101180e5-3316-4d9c-92f4-881e4d3bd626',
                    SchemaType: 'incomming',
                    type: 'schema',
                    Name: 'in 2',
                    Top: 187,
                    Left: -330,
                    FilterFunctionError: false
                  },
                  JSONSchemaID: '39eef4d4-80f8-45f0-86fa-e97f9130d2d1',
                  IncommingModuleID: '0ab8dce3-a1a5-43c4-9e37-bba73a77aff3',
                  OutgoingModuleIDs: [],
                  JoinRelationships: [],
                  DisableSchemaEdit: false
                },
                {
                  ID: '946e092e-583c-4a92-879c-d9ecffa23f72',
                  Data: {
                    id: '946e092e-583c-4a92-879c-d9ecffa23f72',
                    SchemaType: 'incomming',
                    type: 'schema',
                    Name: 'in 1',
                    Top: -6,
                    Left: -338,
                    FilterFunctionError: false
                  },
                  JSONSchemaID: '81153ec2-ea53-4914-8fd5-f33c21776384',
                  IncommingModuleID: '436b0e7d-939a-4c1c-ac83-8f8a122d8ce5',
                  OutgoingModuleIDs: [],
                  JoinRelationships: [],
                  DisableSchemaEdit: true
                },
                {
                  ID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  Data: {
                    id: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                    SchemaType: 'outgoing',
                    type: 'schema',
                    Name: 'out 1',
                    Top: 0,
                    Left: 300,
                    JoinFunctionError: false,
                    Id: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                    FilterFunctionError: false
                  },
                  JSONSchemaID: 'af5a37f7-52e3-4534-ac60-b3b9483fc0e8',
                  IncommingModuleID: '',
                  OutgoingModuleIDs: ['c2818c67-c595-4f4a-8e1f-df381f441d1e'],
                  JoinRelationships: [
                    {
                      Key: '101180e5-3316-4d9c-92f4-881e4d3bd626',
                      Object: {
                        Relationship: 'join',
                        Order: 1
                      }
                    },
                    {
                      Key: '946e092e-583c-4a92-879c-d9ecffa23f72',
                      Object: {
                        Relationship: 'main',
                        Order: 0
                      }
                    }
                  ],
                  DisableSchemaEdit: false
                }
              ],
              SchemaMaps: [
                {
                  ID: 'ef2b9d09-45a9-4c59-ab95-f7e0d20f7b20',
                  IncommingSchemaID: '946e092e-583c-4a92-879c-d9ecffa23f72',
                  OutgoingSchemaID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  Data: {
                    id: 'ef2b9d09-45a9-4c59-ab95-f7e0d20f7b20',
                    type: 'default'
                  },
                  IncommingPropertyID: 'a4e136c3-ec54-4205-a984-e32150ae00da',
                  OutgoingPropertyID: 'a4e136c3-ec54-4205-a984-e32150ae00da'
                },
                {
                  ID: '03d6ec32-0a8f-402e-ac9a-889743a77011',
                  IncommingSchemaID: '946e092e-583c-4a92-879c-d9ecffa23f72',
                  OutgoingSchemaID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  Data: {
                    id: '03d6ec32-0a8f-402e-ac9a-889743a77011',
                    type: 'default'
                  },
                  IncommingPropertyID: '95f6adef-ae28-49a4-ac68-fe991dee5721',
                  OutgoingPropertyID: '95f6adef-ae28-49a4-ac68-fe991dee5721'
                },
                {
                  ID: 'db881a2a-48ef-43de-aa8d-ac08fb5bedec',
                  IncommingSchemaID: '946e092e-583c-4a92-879c-d9ecffa23f72',
                  OutgoingSchemaID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  Data: {
                    id: 'db881a2a-48ef-43de-aa8d-ac08fb5bedec',
                    type: 'default'
                  },
                  IncommingPropertyID: '69e42291-3319-413c-a7ba-9e463fb398ec',
                  OutgoingPropertyID: '69e42291-3319-413c-a7ba-9e463fb398ec'
                },
                {
                  ID: '8cd6dd42-c505-4cc5-bf71-30d08c500374',
                  IncommingSchemaID: '946e092e-583c-4a92-879c-d9ecffa23f72',
                  OutgoingSchemaID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  Data: {
                    id: '8cd6dd42-c505-4cc5-bf71-30d08c500374',
                    type: 'default'
                  },
                  IncommingPropertyID: '9e79f2f6-215b-41c8-b6f0-3fcc0f8c2018',
                  OutgoingPropertyID: '9e79f2f6-215b-41c8-b6f0-3fcc0f8c2018'
                },
                {
                  ID: '0445aaf7-9bfb-4068-b9aa-e2925259ee45',
                  IncommingSchemaID: '946e092e-583c-4a92-879c-d9ecffa23f72',
                  OutgoingSchemaID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  Data: {
                    id: '0445aaf7-9bfb-4068-b9aa-e2925259ee45',
                    type: 'default'
                  },
                  IncommingPropertyID: '94bdbde0-2ad4-4938-b942-1bbbab686227',
                  OutgoingPropertyID: '94bdbde0-2ad4-4938-b942-1bbbab686227'
                },
                {
                  ID: '86483d08-eb9c-4b43-9641-6bdede3f995d',
                  IncommingSchemaID: '101180e5-3316-4d9c-92f4-881e4d3bd626',
                  OutgoingSchemaID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  Data: {
                    id: '86483d08-eb9c-4b43-9641-6bdede3f995d',
                    type: 'default'
                  },
                  IncommingPropertyID: 'cc8991f5-0054-4b3c-89f8-3798ad002cb0',
                  OutgoingPropertyID: 'd856f341-0c2d-42d0-b360-c1cc98b8052c'
                }
              ],
              SchemaFunctions: [
                {
                  ID: '06dfc68b-0ed5-411c-929f-b27116fae8eb',
                  Properties: [
                    {
                      id: 'a4e136c3-ec54-4205-a984-e32150ae00da',
                      SchemaID: '81153ec2-ea53-4914-8fd5-f33c21776384',
                      Order: 0,
                      Source: 'property',
                      NodeID: '946e092e-583c-4a92-879c-d9ecffa23f72'
                    },
                    {
                      id: 'static_integer',
                      StaticValue: '700',
                      StaticValueType: 'integer',
                      Order: 1,
                      Source: 'static'
                    }
                  ],
                  Name: 'SF ID >= 700',
                  Order: 0,
                  FunctionID: 'b3e56e96-80de-431d-933f-243c2cc2c2c2',
                  ExtraData: {
                    Refactored: false,
                    HasErrors: false
                  },
                  ResultNodeID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  ResultPropertyID: '',
                  ReturnValueType: null,
                  ReturnTrueSourceID: null,
                  ReturnTrueSource: 'self',
                  ReturnTrueValue: null,
                  ReturnFalseSourceID: null,
                  ReturnFalseSource: 'self',
                  ReturnFalseValue: null,
                  Type: 'filter'
                },
                {
                  ID: '2fe2c03a-d6d9-494f-b8a4-8b3fc63b37f8',
                  Properties: [
                    {
                      id: 'd856f341-0c2d-42d0-b360-c1cc98b8052c',
                      SchemaID: '81153ec2-ea53-4914-8fd5-f33c21776384',
                      NodeID: '946e092e-583c-4a92-879c-d9ecffa23f72',
                      Order: 0,
                      Source: 'property'
                    },
                    {
                      id: '36b40646-4772-4e7f-b22a-a1a0751b2439',
                      SchemaID: '39eef4d4-80f8-45f0-86fa-e97f9130d2d1',
                      NodeID: '101180e5-3316-4d9c-92f4-881e4d3bd626',
                      Order: 1,
                      Source: 'property'
                    }
                  ],
                  Name: 'Join in1 and in 2',
                  Order: 0,
                  FunctionID: 'b3e56e96-80de-431d-933f-243c2cc2c2c5',
                  ExtraData: {
                    Refactored: false,
                    HasErrors: false
                  },
                  ResultNodeID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  ResultPropertyID: '101180e5-3316-4d9c-92f4-881e4d3bd626',
                  ReturnValueType: null,
                  ReturnTrueSourceID: null,
                  ReturnTrueSource: 'self',
                  ReturnTrueValue: null,
                  ReturnFalseSourceID: null,
                  ReturnFalseSource: 'self',
                  ReturnFalseValue: null,
                  Type: 'join'
                }
              ],
              SchemaFunctionReturns: [
                {
                  PropertyID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  NodeID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  SchemaFunctionsReturnSource: 'function',
                  SchemaFunctionsReturnSourceID: '06dfc68b-0ed5-411c-929f-b27116fae8eb',
                  SchemaFunctionsReturnValue: null,
                  SchemaFunctionsReturnValueType: null,
                  Type: 'filter',
                  ExternalSchemaID: ''
                },
                {
                  PropertyID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  NodeID: 'c2a00a65-c4cc-4c55-bb24-cb6a7093449c',
                  SchemaFunctionsReturnSource: 'function',
                  SchemaFunctionsReturnSourceID: '2fe2c03a-d6d9-494f-b8a4-8b3fc63b37f8',
                  SchemaFunctionsReturnValue: null,
                  SchemaFunctionsReturnValueType: null,
                  Type: 'join',
                  ExternalSchemaID: '101180e5-3316-4d9c-92f4-881e4d3bd626'
                }
              ]
            },
            HasErrors: false,
            _app: 'IoTFlow',
            _token: '578cb1c1-1c4a-4f94-ab9b-65a7a4e62614'
          },
          Text: 'DM1',
          Active: true,
          Lookup: 'Fathym.IoT.Flow.Modules.Core.Fabric.DataMap',
          Catalog: 'Fathym.Core',
          Category: 'Core',
          ControlType: 'Flow',
          Description:
            'Map data stream into a specfic schema to be carried down the flow.  Setup alerts that control warnings or pausing a stream flow.',
          Height: 200.0,
          Icon: 'call_merge',
          IncomingConnectionLimit: -1,
          IncomingConnectionTypes: [],
          ModuleType: 'Fathym.IoT.Flow.Modules.Core.Manager.Common.DataMapModuleManager',
          Name: 'DM1',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Custom',
          Width: 200.0,
          Visible: true,
          ID: 'a0fa019c-4aa8-4a04-bb04-97f41007d639',
          Token: null,
          Status: null
        },
        {
          Deleted: false,
          Left: -982,
          Top: 309,
          Settings: {
            AutoInflate: true,
            MaxThroughputUnits: 1,
            MessageRetentionDays: 7,
            PartitionCount: 32,
            CaptureByteLimit: 10485760,
            CaptureIntervalSeconds: 60,
            Description: 'ae2',
            HubLookup: 'ae2',
            Lookup: 'ae2',
            _app: 'IoTFlow',
            _token: '2c245511-cbb9-46f8-8c1f-2586ad223b11'
          },
          Text: 'ae2',
          Active: true,
          Lookup: 'Fathym.IoT.Flow.Modules.Core.Fabric.DataStream',
          Catalog: 'Fathym.Core',
          Category: 'Input',
          ControlType: 'Gate',
          Description: 'Stream your non device data through Fathym for analysis and optimization.',
          Height: 200.0,
          Icon: 'settings_input_antenna',
          IncomingConnectionLimit: -1,
          IncomingConnectionTypes: [],
          ModuleType: 'Fathym.IoT.Flow.Modules.Core.Manager.Input.DataStreamModuleManager',
          Name: 'ae2',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Rectangle',
          Width: 200.0,
          Visible: true,
          ID: '93d9cc74-26ed-4098-be3d-1a5589121aa5',
          Token: null,
          Status: null
        },
        {
          Deleted: false,
          Left: -1385,
          Top: 113,
          Settings: {
            AutoInflate: true,
            MaxThroughputUnits: 1,
            MessageRetentionDays: 7,
            PartitionCount: 32,
            CaptureByteLimit: 10485760,
            CaptureIntervalSeconds: 60,
            Description: 'testing',
            HubLookup: 'klkl',
            Lookup: 'klkl',
            _app: 'IoTFlow',
            _token: '04893d98-92ee-4f5e-ba36-516476d0eb29'
          },
          Text: 'lkjkl',
          Active: true,
          Lookup: 'Fathym.IoT.Flow.Modules.Core.Fabric.DataStream',
          Catalog: 'Fathym.Core',
          Category: 'Input',
          ControlType: 'Gate',
          Description: 'Stream your non device data through Fathym for analysis and optimization.',
          Height: 200.0,
          Icon: 'settings_input_antenna',
          IncomingConnectionLimit: -1,
          IncomingConnectionTypes: [],
          ModuleType: 'Fathym.IoT.Flow.Modules.Core.Manager.Input.DataStreamModuleManager',
          Name: 'lkjkl',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Rectangle',
          Width: 200.0,
          Visible: true,
          ID: '698e7649-ea53-4b8c-a05d-421858d9a0b6',
          Token: null,
          Status: {
            Code: -100
          }
        },
        {
          Deleted: true,
          Left: -979,
          Top: 714,
          Settings: {
            Description: 'aaaa',
            HubLookup: 'aaa',
            Lookup: 'aaa',
            _app: 'IoTFlow',
            _token: '4d399bbc-976d-4cc8-abd2-8cfa6c0e86ec'
          },
          Text: 'aaaa',
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
          Name: 'aaaa',
          OutgoingConnectionLimit: -1,
          OutgoingConnectionTypes: [],
          Shape: 'Rectangle',
          Width: 200.0,
          Visible: true,
          ID: '0e967b43-aecd-4d7f-a2e9-0b1b7c3c427a',
          Token: null,
          Status: {
            Code: -100
          }
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
        },
        {
          Description: null,
          InputModuleID: '436b0e7d-939a-4c1c-ac83-8f8a122d8ce5',
          Name: null,
          Order: 0,
          OutputModuleID: '91223260-a98d-42df-a906-b737cbb0f17d',
          Transform: null,
          ID: '00000000-0000-0000-0000-000000000000'
        },
        {
          Description: null,
          InputModuleID: '0ab8dce3-a1a5-43c4-9e37-bba73a77aff3',
          Name: null,
          Order: 0,
          OutputModuleID: 'a0fa019c-4aa8-4a04-bb04-97f41007d639',
          Transform: null,
          ID: '00000000-0000-0000-0000-000000000000'
        },
        {
          Description: null,
          InputModuleID: '436b0e7d-939a-4c1c-ac83-8f8a122d8ce5',
          Name: null,
          Order: 0,
          OutputModuleID: 'a0fa019c-4aa8-4a04-bb04-97f41007d639',
          Transform: null,
          ID: '00000000-0000-0000-0000-000000000000'
        },
        {
          Description: null,
          InputModuleID: 'a0fa019c-4aa8-4a04-bb04-97f41007d639',
          Name: null,
          Order: 0,
          OutputModuleID: 'c2818c67-c595-4f4a-8e1f-df381f441d1e',
          Transform: null,
          ID: '00000000-0000-0000-0000-000000000000'
        },
        {
          Description: null,
          InputModuleID: '24bc247c-518b-4f89-9868-2752d2ebec3c',
          Name: null,
          Order: 0,
          OutputModuleID: '28fc9aa6-f572-480a-bd95-3f6be6c83a9e',
          Transform: null,
          ID: '00000000-0000-0000-0000-000000000000'
        },
        {
          Description: null,
          InputModuleID: '530d344c-4bab-445b-8747-a048b8289060',
          Name: null,
          Order: 0,
          OutputModuleID: '28fc9aa6-f572-480a-bd95-3f6be6c83a9e',
          Transform: null,
          ID: '00000000-0000-0000-0000-000000000000'
        },
        {
          Description: null,
          InputModuleID: '28fc9aa6-f572-480a-bd95-3f6be6c83a9e',
          Name: null,
          Order: 0,
          OutputModuleID: '436b0e7d-939a-4c1c-ac83-8f8a122d8ce5',
          Transform: null,
          ID: '00000000-0000-0000-0000-000000000000'
        },
        {
          Description: null,
          InputModuleID: '28fc9aa6-f572-480a-bd95-3f6be6c83a9e',
          Name: null,
          Order: 0,
          OutputModuleID: '596ded28-940e-4aa5-9bf6-9cd5f9046b94',
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
