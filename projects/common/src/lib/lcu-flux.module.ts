import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatSidenavModule,
  MatToolbarModule,
  MatButtonModule,
  MatTabsModule,
  MatTooltipModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatProgressBarModule
} from '@angular/material';
import { FathymSharedModule } from '@lcu-ide/common';
import { FluxComponent } from './controls/flux/flux.component';
import { FluxElementComponent } from './elements/flux-element/flux-element.component';
import { BrowserModule } from '@angular/platform-browser';
import { FluxSurfaceComponent } from './controls/flux-surface/flux-surface.component';
import { jsPlumbToolkitModule } from './jsplumb/jsplumbToolkit.module';
import { FluxParser } from './svc/flux-parser';
import { FluxModuleComponent } from './controls/flux-module/flux-module.component';

@NgModule({
  declarations: [FluxComponent, FluxElementComponent, FluxSurfaceComponent, FluxModuleComponent],
  imports: [
    FathymSharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    jsPlumbToolkitModule.forRoot(),
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  exports: [FluxComponent, FluxElementComponent, FluxSurfaceComponent, FluxModuleComponent],
  entryComponents: [FluxComponent, FluxElementComponent, FluxSurfaceComponent, FluxModuleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LcuFluxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LcuFluxModule,
      providers: [FluxParser]
    };
  }
}
