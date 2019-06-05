import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ImagenService } from 'src/app/services/imagen/imagen.service';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DatosService } from 'src/app/services/datos/datos.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [NgbRatingConfig]
})

export class PerfilComponent implements OnInit, OnDestroy {
  formulario: FormGroup;
  foto: string = "";
  currentRate = 3;
  usuario : usuario;
  private suscUsuario : Subscription;
  cambiarClave: boolean;

  constructor(config: NgbRatingConfig, private imagen: ImagenService, public auth : AuthService, private localStorage : LocalDataService, private datosService : DatosService) {
    this.formulario = new FormGroup({
      'nombre': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'apellidos': new FormControl('', [
                                    Validators.minLength(5)
                                  ]),
      'descripcion': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(15)
                                  ]),
      'claveActual': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(6)
                                  ]),
      'claveNueva': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(6)
                                  ]),
    });
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
    this.cambiarClave = false;
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
    if(this.auth.estaAutentificado()){
      var usuarioActualId = this.localStorage.obtenerUsuarioActual()["id"];
      if(usuarioActualId >= 0){
        this.suscUsuario = this.datosService.obtenerElementoId("usuarios", usuarioActualId).subscribe(datos => {
          if(datos){
            this.usuario = <usuario> datos[0]
            this.formulario.reset({nombre: this.usuario.nombre, apellidos: this.usuario.apellidos, descripcion: this.u});
          }
        }) 
      }
    } 
    setInterval(x =>{
      if(this.imagen.cambios){
        for(let x in this.imagen.imagenesSubidas){
          this.usuario.foto = this.imagen.imagenesSubidas[x];
        }
        this.imagen.cambios = false
      }
    }, 1500)
  }

  guardar() {
    if(this.cambiarClave){
      if(this.usuario.clave != this.formulario.get("claveActual").value){
        Swal.fire({
          type: 'error',
          title: 'Error al guardar los cambios al perfil',
          text: 'La contraseña actual no coincide con la que se digitó'
        });
        return;
      }
    }
    this.usuario.nombre = this.formulario.get("nombre").value
    this.usuario.apellidos = this.formulario.get("apellidos").value
    this.datosService.actualizarElemento("usuarios", this.usuario).catch(err =>{
      Swal.fire({
        type: 'error',
        title: 'Error al guardar los cambios al perfil',
        text: err.message
      });
    }).then(()=>{
      Swal.fire({
        type: 'success',
        title: 'Guardado correctamente'
      });
    });
  }

  cargarImagen(e) {
    if(e.target.files.length != 0) {
      this.imagen.cargarImagen(e.target.files);
    }
  }

  ngOnDestroy(): void{
    if(this.suscUsuario){
      this.suscUsuario.unsubscribe();
    }
  }
}
