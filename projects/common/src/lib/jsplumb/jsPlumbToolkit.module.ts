import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { jsPlumbService } from './jsplumb.service';
import { jsPlumbPaletteComponent } from './palette/palette.component';

@NgModule({
  providers: [jsPlumbService],
  declarations: [jsPlumbPaletteComponent],
  exports: [jsPlumbPaletteComponent],
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
