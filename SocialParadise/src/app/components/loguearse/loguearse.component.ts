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
  
  correo: string;
  clave : string;
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

}
