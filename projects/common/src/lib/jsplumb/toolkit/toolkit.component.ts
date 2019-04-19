import { Component, OnInit, Input, ElementRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { jsPlumbService } from '../jsplumb.service';
import { jsPlumb, jsPlumbToolkit, Surface } from 'jsplumbtoolkit';

@Component({
  selector: 'lcu-jsplumb-toolkit',
  templateUrl: './toolkit.component.html',
  styleUrls: ['./toolkit.component.scss']
})
export class jsPlumbToolkitComponent implements OnInit {
  //  Fields
  //  Properties
  @Input()
  jtkId: string;

  @Input()
  surfaceId: string;

  @Input()
  view: any;

  @Input()
  renderParams: any;

  @Input()
  toolkitParams: any;

  @Input()
  methods: any;

  public Surface: Surface;

  public Toolkit: jsPlumbToolkit;

  @Input()
  nodeResolver: Function;

  //  Constructors
  constructor(
    private el: ElementRef,
    private $jsplumb: jsPlumbService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {
    this.Surface = null;

    this.Toolkit = null;
  }

  //
  // abstract out the difference in accessing nativeelement between angular 2 (first case) and angular 4 (second case)
  //
  getNativeElement(component: any) {
    return (component._nativeElement || component.location.nativeElement).childNodes[0];
  }

  ngOnInit() {}

  ngAfterViewInit() {
    //  TODO:  Must be a better way to get rid of the ngIf check error... tied to similar fix in flux-surface.component
    setTimeout(() => {
      const id = this.jtkId;

      if (!id) {
        throw new Error('jtk-id attribute not specified on jsplumb-toolkit component');
      }

      this.Toolkit = this.$jsplumb.GetToolkit(id, this.toolkitParams);

      const view = this.view || {};

      const renderParams = jsPlumb.extend(this.renderParams || {}, {
        templateRenderer: (directiveId: string, data: any, toolkit: jsPlumbToolkit, objectType: string) => {
          const comp = this.componentFactoryResolver.resolveComponentFactory(this.nodeResolver(directiveId));

          const createdComponent: any = this.viewContainerRef.createComponent(comp);

          createdComponent._component.obj = data || {};

          createdComponent._component.toolkit = toolkit;

          createdComponent._component.surface = this.Surface;

          const nativeElement = this.getNativeElement(createdComponent);

          createdComponent._component._el = nativeElement;

          createdComponent._component._el._jsPlumbNgComponent = createdComponent._component;

          // angular 2 only.
          createdComponent._parentView && createdComponent._parentView.detectChanges(false);

          const methods = this.methods || {};

          for (const m in methods) {
            if (methods.hasOwnProperty(m)) {
              createdComponent._component[m] = methods[m];
            }
          }

          return nativeElement;
        },
        view: view,
        container: this.el.nativeElement.childNodes[0]
      });

      this.Surface = this.Toolkit.render(renderParams);
      this.$jsplumb.AddSurface(this.surfaceId, this.Surface);

      // nodeUpdated event bind
      this.Toolkit.bind('nodeUpdated', (params: any) => {
        const info = this.Surface.getObjectInfo(params.node);
        if (info.el && info.el._jsPlumbNgComponent) {
          info.el._jsPlumbNgComponent.obj = params.node.data;
        }
      });
    }, 0);
  }
}
