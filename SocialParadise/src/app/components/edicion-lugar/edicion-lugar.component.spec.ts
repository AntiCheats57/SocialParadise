import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionLugarComponent } from './edicion-lugar.component';

describe('EdicionLugarComponent', () => {
  let component: EdicionLugarComponent;
  let fixture: ComponentFixture<EdicionLugarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdicionLugarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdicionLugarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
