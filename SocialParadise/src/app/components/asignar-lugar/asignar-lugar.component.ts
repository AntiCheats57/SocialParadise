import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-asignar-lugar',
  templateUrl: './asignar-lugar.component.html',
  styleUrls: ['./asignar-lugar.component.css']
})
export class AsignarLugarComponent implements OnInit {

  formulario:FormGroup;

  constructor() {
    this.formulario = new FormGroup({
    'nombre':new FormControl('', [
                                  Validators.required,
                                  Validators.minLength(4)
                                ]),
    'editor':new FormControl('', [
                                  Validators.required,
                                  Validators.minLength(10)
                                ])
  }); }
  

  ngOnInit() {
  }

  guardar() {

  }

}
