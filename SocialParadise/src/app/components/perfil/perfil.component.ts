import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [NgbRatingConfig]
})
export class PerfilComponent implements OnInit {

  formulario:FormGroup;
  currentRate:number = 3;

  constructor(config: NgbRatingConfig) {
    this.formulario = new FormGroup({
      'nombre':new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'apellidos':new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(6)
                                  ]),
      'descripcion':new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(10)
                                  ]),
      'correo':new FormControl('', [
                                    Validators.required,
                                    Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")
                                  ])
    });

    config.max = 5;
    config.readonly = true;
    
   }

  ngOnInit() {
  }
  enviar(){
    console.log(this.formulario.value);
    console.log(this.formulario);

    this.formulario.reset({nombre:'', mensaje:'',asunto:'', correo:''});
  }
}
