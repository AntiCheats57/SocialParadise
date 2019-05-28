import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaizComponent } from './raiz.component';

describe('RaizComponent', () => {
  let component: RaizComponent;
  let fixture: ComponentFixture<RaizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
