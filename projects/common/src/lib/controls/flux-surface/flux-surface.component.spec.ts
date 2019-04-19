import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxSurfaceComponent } from './flux-surface.component';

describe('FluxSurfaceComponent', () => {
  let component: FluxSurfaceComponent;
  let fixture: ComponentFixture<FluxSurfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluxSurfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluxSurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
