import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxModulesBankComponent } from './flux-modules-bank.component';

describe('FluxModulesBankComponent', () => {
  let component: FluxModulesBankComponent;
  let fixture: ComponentFixture<FluxModulesBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluxModulesBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluxModulesBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
