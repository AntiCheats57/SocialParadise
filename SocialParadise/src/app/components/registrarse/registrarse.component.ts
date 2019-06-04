import { Component, OnInit } from '@angular/core';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DatosService } from 'src/app/services/datos/datos.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})

export class RegistrarseComponent implements OnInit {
  formulario: FormGroup;
  usuario: usuario;

  constructor(private localDataService: LocalDataService, private router: Router, private auth: AuthService, private datosService : DatosService) {

    this.formulario = new FormGroup({
      'nombre': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'apellidos': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(5)
                                  ]),
      'usuario': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(6)
                                  ]),                           
      'clave': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'email': new FormControl('', [
                                    Validators.required,
                                    Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")
                                  ])
    });
  }

  ngOnInit() {
    this.formulario.setValue({nombre: "", apellidos: "", usuario: "", clave: "", email: "@.com" });
    this.usuario = {
      id : 0,
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

  registrarEmail(): void {
    this.usuario.nombre = this.formulario.controls['nombre'].value;
    this.usuario.apellidos = this.formulario.controls['apellidos'].value;
    this.usuario.usuario = this.formulario.controls['usuario'].value;
    this.usuario.clave = this.formulario.controls['clave'].value;
    this.usuario.correo = this.formulario.controls['email'].value;
    
    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
    this.auth.registrarUsuario(this.usuario).then((res) => {
      this.usuario.idFB = res["user"].uid;
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
            title: 'Error al registrarse',
            timer: 1500
          })      
        }).then(()=>{
          this.auth.almacenarUsuarioLocalStorage(this.usuario.idFB)
        })
      }) 
      Swal.close();
      this.router.navigateByUrl('');
    }).catch ( err => {
      Swal.fire({
          type: 'error',
          title: 'Error al registrarse',
          text: err.message
        });
    });
  }

  registrarGoogle() {
    this.auth.loginGoogle().then((res) => {
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
            title: 'Error al registrarse',
            timer: 1500
          })      
        }).then(()=>{
          this.auth.almacenarUsuarioLocalStorage(this.usuario.idFB)
        })
      }) 
      Swal.close();
      this.router.navigateByUrl('');
    }).catch ( err => console.log(err));
  }

  registrarFacebook() {
    this.auth.loginFacebook().then((res) => {
      this.usuario.nombre = res.user.displayName;
      this.usuario.idFB = res.user.uid;
      this.usuario.foto = res.user.photoURL
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
            title: 'Error al registrarse',
            timer: 1500
          })      
        }).then(()=>{
          this.auth.almacenarUsuarioLocalStorage(this.usuario.idFB)
        })
      }) 
      Swal.close();
      this.router.navigateByUrl('');   
    }).catch ( err => console.log(err));
  }

}
