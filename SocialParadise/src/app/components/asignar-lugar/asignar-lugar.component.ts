import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuario/usuario.service';
import { DecimalPipe } from '@angular/common';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { Observable } from 'rxjs';
import { lugar } from 'src/app/interfaces/lugar.interface';
declare var $: any;

@Component({
  selector: 'app-asignar-lugar',
  templateUrl: './asignar-lugar.component.html',
  styleUrls: ['./asignar-lugar.component.css'],
  providers: [UsuariosService, DecimalPipe]
})

export class AsignarLugarComponent implements OnInit {
  usuarios$: Observable<usuario[]>;
  total$: Observable<number>;
  formulario: FormGroup;
  indexLugar: string;
  encabezadoModal: string;
  editor: usuario;

  constructor(private router: Router, private route: ActivatedRoute, public service: UsuariosService) {
    this.usuarios$ = service.usuarios$;
    this.total$ = service.total$;
    this.editor
    this.formulario = new FormGroup({
      'nombre': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'editor': new FormControl('')
    });
  }

  ngOnInit() {
    this.editor = {
      id: 0,
      idFB: "",
      nombre: "",
      apellidos: "",
      usuario: "",
      clave: "",
      correo: "",
      foto: "",
      resenas: [],
      lugaresAsignados: [],
      lugaresSeguidos: [],
      admin: false
    }
    this.indexLugar = this.route.snapshot.params['id'];
    if (this.indexLugar) {
      this.encabezadoModal = "Editar lugar";
    } else {
      this.encabezadoModal = "Agregar lugar";
    }
    $(document).ready(function() {
      $("#lugarModal").modal("show");
    });
  }

  guardar() {
  }

  obtenerEditor(usuario: usuario) {
    this.editor = usuario;
  }

}
