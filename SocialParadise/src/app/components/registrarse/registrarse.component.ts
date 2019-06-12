import { Component, OnInit, ViewChild } from '@angular/core';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { DatosService } from 'src/app/services/datos/datos.service';
import { text } from '@angular/core/src/render3';

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
                                    Validators.minLength(6)
                                  ]),
      'email': new FormControl('', [
                                    Validators.required,
                                    Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")
                                  ])
    });
  }

  ngOnInit() {
    this.formulario.setValue({nombre: "", apellidos: "", usuario: "", clave: "", email: "" });
    this.usuario = {
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

  registrarEmail(): void {    
    if(!this.formulario.valid){
      Swal.fire({
        type: 'error',
        title: 'Error al guardar los cambios al perfil',
        text: 'Debe completar correctamente todos los campos'
      });
      return;
    }
    var suscripcion = this.datosService.obtenerColeccionCondicion("usuarios", "usuario", this.formulario.controls['usuario'].value).subscribe(usu=>{
      if(usu == undefined || (usu != undefined && usu.length == 0)){
        this.usuario.nombre = this.formulario.controls['nombre'].value;
        this.usuario.apellidos = this.formulario.controls['apellidos'].value;
        this.usuario.usuario = this.formulario.controls['usuario'].value;
        this.usuario.usuario = this.usuario.usuario.toLowerCase()
        this.usuario.clave = this.formulario.controls['clave'].value;
        this.usuario.correo = this.formulario.controls['email'].value;
    
        Swal.fire({
          allowOutsideClick: false,
          type: 'info',
          text: 'Espere por favor...'
        });
        Swal.showLoading();
        this.auth.registrarUsuario(this.usuario).then((res) => {
          if(res != undefined){
            this.usuario.idFB = res["user"].uid;
            this.datosService.obtenerUltimoId("usuarios").then(datos => {
              if(datos != undefined && datos.docs[0] != undefined){
                this.usuario.id = (<usuario> datos.docs[0].data()).id + 1
              }
              else{
                this.usuario.id = 0
              }          
              this.usuario.foto = 'https://firebasestorage.googleapis.com/v0/b/socialparadiseuna.appspot.com/o/default%2Fusuario.svg?alt=media&token=a2b58f56-2f3d-46dc-a09a-a95056611b13'
              this.datosService.insertarElemento("usuarios", this.usuario, false).catch(error => {
                Swal.fire({
                  type: 'error',
                  title: 'Error al registrarse',
                  text: this.error(error)
                })                
              }).then(()=>{
                this.auth.almacenarUsuarioLocalStorage(this.usuario.idFB);
                
              })
            }) 
            Swal.close();
            this.router.navigateByUrl('');
            suscripcion.unsubscribe();
          }
        }).catch ( err => {
          Swal.fire({
              type: 'error',
              title: 'Error al registrarse',
              text: this.error(err)
            });
        });
      }
      else{
        Swal.fire({
          type: 'error',
          title: 'Error al registrarse',
          text: 'Ya existe un usuario registrado con ese nombre de usuario'
        });
      }
    })
  }

  registrarGoogle() {
    this.auth.loginGoogle().then((res) => {
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
                title: 'Error al registrarse',
                text: this.error(error)
              })      
            }).then(()=>{
              this.auth.almacenarUsuarioLocalStorage(this.usuario.idFB)
            })
          })
        }
        else if(datos && datos["idFB"] == res.user.uid){
          Swal.fire({
            type: 'error',
            title: 'Error al registrarse',
            text: 'Esta cuenta ya está registrada, por favor inicie sesión'
          }) 
          this.auth.logout()
          this.router.navigate(["/registrarse"])
          return;
        }
        else{
          Swal.fire({
            type: 'error',
            title: 'Error al registrarse',
            text: 'No se pudo comprobar si la cuenta ya estaba registrada'
          }) 
        }
        suscripcion.unsubscribe()
      })
      Swal.close();
      this.router.navigateByUrl('');
    }).catch ( err => err);
  }

  registrarFacebook() {
    this.auth.loginFacebook().then((res) => {
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
                title: 'Error al registrarse',
                text: this.error(error)
              })      
            }).then(()=>{
              this.auth.almacenarUsuarioLocalStorage(this.usuario.idFB)
            })
          })
        }
        else if(datos && datos["idFB"] == res.user.uid){
          Swal.fire({
            type: 'error',
            title: 'Error al registrarse',
            text: 'Esta cuenta ya está registrada, por favor inicie sesión'
          }) 
          this.auth.logout()
          this.router.navigate(["/registrarse"])
          return;
        }
        else{
          Swal.fire({
            type: 'error',
            title: 'Error al registrarse',
            text: 'No se pudo comprobar si la cuenta ya estaba registrada'
          }) 
        }
        suscripcion.unsubscribe()
      })
      Swal.close();
      this.router.navigateByUrl('');   
    }).catch ( err => err);
  }

  validar() {
    this.markFormGroupTouched(this.formulario);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  error(err: any) {
    switch (err.code) {
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya es usado por otra cuenta';
        case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      default:
        return err.message;
    }
  }
}
