import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoguearseComponent } from './loguearse.component';

describe('LoguearseComponent', () => {
  let component: LoguearseComponent;
  let fixture: ComponentFixture<LoguearseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoguearseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoguearseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
