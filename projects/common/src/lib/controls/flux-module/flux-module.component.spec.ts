import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxModuleComponent } from './flux-module.component';

describe('FluxModuleComponent', () => {
  let component: FluxModuleComponent;
  let fixture: ComponentFixture<FluxModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluxModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluxModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
