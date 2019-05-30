import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ImagenService } from 'src/app/services/imagen/imagen.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [NgbRatingConfig]
})

export class PerfilComponent implements OnInit {
  formulario: FormGroup;
  foto: string = "";
  currentRate = 3;

  constructor(config: NgbRatingConfig, private imagen: ImagenService) {
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

  cargarImagen(e) {
    if(e.target.files.length != 0) {
      this.imagen.cargarImagen(e.target.files);
    }
  }

}
