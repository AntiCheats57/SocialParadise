import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ImagenService } from 'src/app/services/imagen/imagen.service';
declare var $: any;

@Component({
  selector: 'app-edicion-lugar',
  templateUrl: './edicion-lugar.component.html',
  styleUrls: ['./edicion-lugar.component.css']
})

export class EdicionLugarComponent implements OnInit {
  formulario: FormGroup;
  indexNoticia: string;
  lugares : []

  constructor(private router: Router, private route: ActivatedRoute, private imagen: ImagenService) {
    this.formulario = new FormGroup({
      'nombre': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'descripcion': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(15)
                                  ]),
      'video': new FormControl('', [
                                    Validators.required,
                                    Validators.pattern("^http:\/\/(.*\.(com$|net$|org$))")
                                  ])
    });
  }

  ngOnInit() {
    this.indexNoticia = this.route.snapshot.params['id'];
    $(document).ready(function() {
      $("#lugarModal").modal("show");
    });

  }

  guardar() {
  }

  cargarImagen(e) {
    if(e.target.files.length != 0) {
      this.imagen.cargarImagen(e.target.files);
    }
  }

}
