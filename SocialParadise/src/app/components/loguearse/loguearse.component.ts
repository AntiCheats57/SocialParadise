import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loguearse',
  templateUrl: './loguearse.component.html',
  styleUrls: ['./loguearse.component.css']
})

export class LoguearseComponent implements OnInit {
  
  correo: string = '';
  clave : string = '';
  refrescar: boolean;

  constructor(private auth: AuthService, private router:Router) { 
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
    }).catch ( err => err);
  }

  loginFacebook() {
    this.auth.loginFacebook().then((res) => {
      if(res){
        this.auth.almacenarUsuarioLocalStorage(<string> res["user"]["uid"]);
      }
      this.router.navigateByUrl('');
    }).catch ( err => err);
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
      this.clave = '';
      Swal.fire({
        type: 'error',
        title: 'Error al autenticar',
        text: this.error(err)
      });
    });
  }

  error(err: any) {
    switch (err.code) {
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/argument-error':
        return 'Correo electrónico y/o contraseña no válidos';
      case 'auth/invalid-email':
        return 'Ingrese un correo electrónico válido';
      default:
        return err.message;
    }
  }

}
