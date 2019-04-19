import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { jsPlumbService } from './jsplumb.service';
import { jsPlumbToolkitComponent } from './toolkit/toolkit.component';
import { jsPlumbPaletteComponent } from './palette/palette.component';
import { jsPlumbMiniviewComponent } from './miniview/miniview.component';

@NgModule({
  providers: [jsPlumbService],
  declarations: [jsPlumbToolkitComponent, jsPlumbMiniviewComponent, jsPlumbPaletteComponent],
  exports: [jsPlumbToolkitComponent, jsPlumbMiniviewComponent, jsPlumbPaletteComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class jsPlumbToolkitModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: jsPlumbToolkitModule,
      providers: [jsPlumbService]
    };
  }
}
