import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

//Imagen
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs/internal/Observable';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { DatosService } from 'src/app/services/datos/datos.service';
import { ImagenService } from 'src/app/services/imagen/imagen.service';

@Component({
  selector: 'app-loguearse',
  templateUrl: './loguearse.component.html',
  styleUrls: ['./loguearse.component.css']
})

export class LoguearseComponent implements OnInit {
  
  correo: string;
  clave : string;
  refrescar: boolean;
  
  //imagen
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  @ViewChild('imageUser') inputImageUser: ElementRef;
  // 

  constructor(private auth: AuthService,private imagen: ImagenService, private datosService : DatosService, private localStorage : LocalDataService, private router:Router, private storage: AngularFireStorage) { 
    this.refrescar = true;
  }

  ngOnInit() { 
  }

  loginGoogle() {
    this.auth.loginGoogle().then((res) => {
      if(res){
        this.auth.almacenarUsuarioLocalStorage(<string> res["user"]["uid"]);
      }
      this.router.navigateByUrl('');
    }).catch ( err => console.log(err));
  }

  loginFacebook() {
    this.auth.loginFacebook().then((res) => {
      if(res){
        this.auth.almacenarUsuarioLocalStorage(<string> res["user"]["uid"]);
      }
      this.router.navigateByUrl('');
    }).catch ( err => console.log(err));
  }

  loginEmail() {
    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
    this.auth.loginEmail(this.correo, this.clave).then((res) => {
      Swal.close(); 
      if(res){
        this.auth.almacenarUsuarioLocalStorage(<string> res["user"]["uid"]);
      }     
      this.router.navigateByUrl('');
    }).catch ( err => {
      Swal.fire({
        type: 'error',
        title: 'Error al autenticar',
        text: err.message
      });
    });
  }
  
  cargarImagen(e) {
     if(e.target.files.length != 0) {
       this.imagen.cargarImagen(e.target.files);
     }
   }
  
   usuarioActual() {
     
   }

}
