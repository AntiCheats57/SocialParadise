import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [NgbRatingConfig]
})

export class PerfilComponent implements OnInit {
  formulario: FormGroup;
  currentRate = 3;

  constructor(config: NgbRatingConfig) {
    this.formulario = new FormGroup({
      'nombre': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'apellidos': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(5)
                                  ]),
      'descripcion': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(15)
                                  ])
    });
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
  }

  enviar() {
    this.formulario.reset({nombre: '', mensaje: '', asunto: '', correo: ''});
  }

}
