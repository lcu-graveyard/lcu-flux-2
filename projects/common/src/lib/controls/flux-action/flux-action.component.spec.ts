import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxActionComponent } from './flux-action.component';

describe('FluxActionComponent', () => {
  let component: FluxActionComponent;
  let fixture: ComponentFixture<FluxActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluxActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluxActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
