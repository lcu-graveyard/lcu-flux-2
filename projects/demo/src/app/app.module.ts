import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FathymSharedModule, LCUServiceSettings } from '@lcu-ide/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { LcuFluxModule } from '@lcu-ide/lcu-flux-common';
import { MatIconRegistry } from '@angular/material';

export const settings = FathymSharedModule.DefaultServiceSettings(environment);

@NgModule({
  declarations: [AppComponent],
  imports: [FathymSharedModule.forRoot(), AppRoutingModule, BrowserModule, BrowserAnimationsModule, LcuFluxModule.forRoot()],
  providers: [
    {
      provide: LCUServiceSettings,
      useValue: settings
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  //  Constructors
  constructor(protected matIconRegistry: MatIconRegistry) {
    matIconRegistry.registerFontClassAlias('fa', 'fas');
  }
}
