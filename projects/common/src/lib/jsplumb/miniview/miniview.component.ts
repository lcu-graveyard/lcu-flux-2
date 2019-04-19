import { Component, AfterViewInit, Input, ElementRef } from '@angular/core';
import { jsPlumbService } from '../jsplumb.service';

@Component({
  selector: 'lcu-jsplumb-miniview',
  templateUrl: './miniview.component.html',
  styleUrls: ['./miniview.component.scss']
})
export class jsPlumbMiniviewComponent implements AfterViewInit {
  @Input()
  surfaceId: string;

  constructor(private el: ElementRef, private $jsplumb: jsPlumbService) {}

  ngAfterViewInit() {
    if (!this.surfaceId) {
      throw new Error('surface-id attribute not specified on jsplumb-miniview component');
    }

    this.$jsplumb.AddMiniview(this.surfaceId, {
      container: this.el.nativeElement.childNodes[0]
    });
  }
}
