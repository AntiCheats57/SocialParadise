import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.css']
})
export class PruebasComponent implements OnInit {
  formulario:FormGroup;

  constructor() { 
    this.formulario = new FormGroup({
      'titulo':new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'asunto':new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(6)
                                  ]),
      'contenido':new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(10)
                                  ]),
      'correo':new FormControl('', [
                                    Validators.required,
                                    Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")
                                  ])
    });
  }

  ngOnInit() {
  }

}
