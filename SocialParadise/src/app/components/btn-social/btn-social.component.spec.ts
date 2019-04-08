import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnSocialComponent } from './btn-social.component';

describe('BtnSocialComponent', () => {
  let component: BtnSocialComponent;
  let fixture: ComponentFixture<BtnSocialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnSocialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
