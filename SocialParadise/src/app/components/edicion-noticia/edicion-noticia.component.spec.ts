import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionNoticiaComponent } from './edicion-noticia.component';

describe('EdicionNoticiaComponent', () => {
  let component: EdicionNoticiaComponent;
  let fixture: ComponentFixture<EdicionNoticiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdicionNoticiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdicionNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
