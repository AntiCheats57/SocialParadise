import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarLugarComponent } from './asignar-lugar.component';

describe('AsignarLugarComponent', () => {
  let component: AsignarLugarComponent;
  let fixture: ComponentFixture<AsignarLugarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarLugarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarLugarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
