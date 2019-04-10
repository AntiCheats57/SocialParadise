import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edicion-noticia',
  templateUrl: './edicion-noticia.component.html',
  styleUrls: ['./edicion-noticia.component.css']
})
export class EdicionNoticiaComponent implements OnInit {

  formulario:FormGroup;

  constructor() {
    this.formulario = new FormGroup({
    'titulo':new FormControl('', [
                                  Validators.required,
                                  Validators.minLength(4)
                                ]),
    'contenido':new FormControl('', [
                                  Validators.required,
                                  Validators.minLength(10)
                                ])
  }); }
  

  ngOnInit() {
  }
  guardar() {

  }


}