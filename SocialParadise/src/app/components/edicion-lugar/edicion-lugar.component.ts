import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edicion-lugar',
  templateUrl: './edicion-lugar.component.html',
  styleUrls: ['./edicion-lugar.component.css']
})
export class EdicionLugarComponent implements OnInit {

  formulario:FormGroup;

  constructor() {
    this.formulario = new FormGroup({
    'nombre':new FormControl('', [
                                  Validators.required,
                                  Validators.minLength(4)
                                ]),
    'descripcion':new FormControl('', [
                                  Validators.required,
                                  Validators.minLength(10)
                                ]),
    'video':new FormControl('', [
                                  Validators.required,
                                  Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")
                                ])
  }); }
  

  ngOnInit() {
  }

  guardar() {

  }

}
