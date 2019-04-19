import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxElementComponent } from './flux-element.component';

describe('FluxElementComponent', () => {
  let component: FluxElementComponent;
  let fixture: ComponentFixture<FluxElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluxElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluxElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
