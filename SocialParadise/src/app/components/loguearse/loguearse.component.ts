import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatosService } from 'src/app/services/datos/datos.service';
import { usuario } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-loguearse',
  templateUrl: './loguearse.component.html',
  styleUrls: ['./loguearse.component.css']
})

export class LoguearseComponent implements OnInit {
  
  correo: string = '';
  clave : string = '';
  refrescar: boolean;
  usuario: usuario;

  constructor(private auth: AuthService, private router:Router, private datosService : DatosService) { 
    this.refrescar = true;
  }

  ngOnInit() { this.usuario = {
    id : -1,
    idFB : "",
    correo : "",
    admin : false,
    apellidos : "",
    clave : "",
    foto : "",
    lugaresAsignados : [],
    lugaresSeguidos : [],
    nombre : "",
    resenas : [],
    usuario : "" 
  };
  }

  loginGoogle() {
    this.auth.loginGoogle().then((res) => {
      if(res){
        var suscripcion = this.datosService.obtenerElementoIdFB("usuarios", res.user.uid).subscribe(datos => {
          if((datos && datos["idFB"] != res.user.uid) || datos == undefined){          
            this.usuario.nombre = res.user.displayName;
            this.usuario.idFB = res.user.uid;
            this.usuario.foto = res.user.photoURL
            this.usuario.correo = res.user.email
            this.datosService.obtenerUltimoId("usuarios").then(datos => {
              if(datos != undefined && datos.docs[0] != undefined){
                this.usuario.id = (<usuario> datos.docs[0].data()).id + 1
              }
              else{
                this.usuario.id = 0
              }          
              this.datosService.insertarElemento("usuarios", this.usuario, false).catch(error => {
                Swal.fire({
                  type: 'error',
                  title: 'Error al registrar el usuario',
                  text: this.error(error)
                })      
              }).then(()=>{
                this.auth.almacenarUsuarioLocalStorage(this.usuario.idFB)
              })
            })
          }
          this.auth.almacenarUsuarioLocalStorage(res.user.uid)
          suscripcion.unsubscribe()
        })
        Swal.close();
        this.router.navigateByUrl('');
      }
      this.router.navigateByUrl('');
    }).catch ( err => err);
  }

  loginFacebook() {
    this.auth.loginFacebook().then((res) => {
      if(res){
        var suscripcion = this.datosService.obtenerElementoIdFB("usuarios", res.user.uid).subscribe(datos => {
          if((datos && datos["idFB"] != res.user.uid) || datos == undefined){          
            this.usuario.nombre = res.user.displayName;
            this.usuario.idFB = res.user.uid;
            this.usuario.foto = res.user.photoURL
            this.usuario.correo = res.user.email
            this.datosService.obtenerUltimoId("usuarios").then(datos => {
              if(datos != undefined && datos.docs[0] != undefined){
                this.usuario.id = (<usuario> datos.docs[0].data()).id + 1
              }
              else{ 
                this.usuario.id = 0
              }          
              this.datosService.insertarElemento("usuarios", this.usuario, false).catch(error => {
                Swal.fire({
                  type: 'error',
                  title: 'Error al registrar el usuario',
                  text: this.error(error)
                })      
              }).then(()=>{
                this.auth.almacenarUsuarioLocalStorage(this.usuario.idFB)
              })
            })
          }
          this.auth.almacenarUsuarioLocalStorage(res.user.uid)
          suscripcion.unsubscribe()
        })
        Swal.close();
        this.router.navigateByUrl('');
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
