import { Component, OnInit, Input } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { DatosService } from 'src/app/services/datos/datos.service';
import { resena } from 'src/app/interfaces/resena.interface';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.css'],
  providers: [NgbRatingConfig]
})

export class ComentarioComponent implements OnInit {

  lugarId: number;
  currentRate = 3;
  usuario: any;
  resena: resena;

  constructor(config: NgbRatingConfig, private localStorage: LocalDataService, public auth : AuthService, private datosService : DatosService, private rutaActual: ActivatedRoute) {
    config.max = 5;
    config.readonly = false;
    this.lugarId = parseInt(this.rutaActual.snapshot.paramMap.get("id"));
  }

  ngOnInit() {
    this.usuario = {
      id : 0,
      idFB: "",
      foto : "",
      nombre : "",
      correo : "",
      usuario : ""
    }
    this.resena = {      
      id: 0,
      idFB: "",
      lugar: 0,
      usuario: 0,
      valoracion: 0,
      comentario: "",
      fechaPublicacion: ""
    }
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(){
    if(this.auth.estaAutentificado()){
      var usu = this.localStorage.obtenerUsuarioActual();      
      this.usuario["id"] = usu["id"];
      this.usuario["foto"] = usu["foto"];
      this.usuario["nombre"] = usu["nombre"];
      this.usuario["usuario"] = usu["usuario"];       
    }
  }

  agregarComentario(){
    this.resena.fechaPublicacion = formatDate(Date.now(), "MM/dd/yyyy hh:mm a", "en-US");
    this.resena.usuario = this.usuario["id"];
    this.resena.valoracion = this.currentRate;
    this.resena.lugar = this.lugarId;
    this.datosService.insertarElemento("resenas", this.resena, true)
  }

}
