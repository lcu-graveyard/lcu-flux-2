import { Component, AfterViewInit, ElementRef, Input } from '@angular/core';
import { jsPlumbService } from '../jsplumb.service';

@Component({
  selector: '[lcu-jsplumb-palette]',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss']
})
export class jsPlumbPaletteComponent implements AfterViewInit {
  @Input()
  selector: string;

  @Input()
  surfaceId: string;

  @Input()
  typeExtractor: Function;

  @Input()
  locationSetter: Function;

  @Input()
  generator: Function;

  constructor(private el: ElementRef, private $jsplumb: jsPlumbService) {}

  ngAfterViewInit() {
    const self = this;
    if (!this.surfaceId) {
      throw new Error('jsplumb-palette: surfaceId attribute not set.');
    }
    if (!this.selector) {
      throw new Error('jsplumb-palette: selector attribute not set.');
    }
    this.$jsplumb.GetSurface(
      this.surfaceId,
      function(surface: any) {
        surface.registerDroppableNodes({
          source: self.el.nativeElement,
          selector: self.selector,
          dragOptions: this.dragOptions || {
            zIndex: 50000,
            cursor: 'move',
            clone: true
          },
          typeExtractor: self.typeExtractor,
          dataGenerator: self.generator,
          locationSetter: self.locationSetter
        });
      },
      null
    );
  }
}
