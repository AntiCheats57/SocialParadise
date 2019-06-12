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
import { lugar } from 'src/app/interfaces/lugar.interface';
import { resena } from 'src/app/interfaces/resena.interface';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [NgbRatingConfig]
})

export class PerfilComponent implements OnInit, OnDestroy {
  formulario: FormGroup;
  usuario : usuario;
  private suscUsuario : Subscription;
  private suscResena : Subscription;
  lugaresSeguidos : lugar[];
  resenas : resena[];
  lugaresDescripcion : string[]

  constructor(config: NgbRatingConfig, private imagen: ImagenService, public auth : AuthService, private localStorage : LocalDataService, private datosService : DatosService) {
    this.formulario = new FormGroup({
      'nombre': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'apellidos': new FormControl('', [
                                    Validators.minLength(5)
                                  ]),
      'correo': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(7)
                                  ]),
                                  
      'usuario': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(3)
                                  ])
    });
    this.formulario.get("correo").disable()
    config.max = 5;
    config.readonly = true;
    this.lugaresSeguidos = []
  }

  ngOnInit() {
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
            this.formulario.reset({nombre: this.usuario.nombre, apellidos: this.usuario.apellidos,  correo: this.usuario.correo, usuario: this.usuario.usuario});
            this.lugaresSeguidos = []
            var suscripcion
            for(var i in this.usuario.lugaresSeguidos){
              suscripcion = this.datosService.obtenerElementoId("lugares", this.usuario.lugaresSeguidos[i].toString()).subscribe(lugar =>{
                if(lugar){
                  var indiceAgregado = -1;
                  for(let j in this.lugaresSeguidos){
                    if(this.lugaresSeguidos[j].id === (<lugar> lugar[0]).id){
                    indiceAgregado = parseInt(j)
                    break;
                    }
                  }
                  if(indiceAgregado == -1){
                    this.lugaresSeguidos.push(<lugar> lugar[0]);
                  }                    
                  else{
                    this.lugaresSeguidos[indiceAgregado] = <lugar> lugar[0];
                  }
                  if(this.lugaresSeguidos.length == this.usuario.lugaresSeguidos.length){
                    suscripcion.unsubscribe()
                  }
                }                  
              })
            }
          }
        }) 
        this.suscResena = this.datosService.obtenerColeccionCondicion("resenas", "usuario", usuarioActualId).subscribe(datos => {
          if(datos){
            this.resenas = datos
            this.resenas.sort((x, y) => {
              return -1 * ((new Date(x.fechaPublicacion)).getTime() - (new Date(y.fechaPublicacion)).getTime())
            })
            console.info(this.resenas.length)
            var suscripcion     
            this.lugaresDescripcion = []       
            for(var i in this.resenas){
              suscripcion = this.datosService.obtenerColeccionCondicion("lugares", "id", this.resenas[i].lugar).subscribe(lugar => {
                if(lugar != undefined && lugar.length > 0){
                  this.lugaresDescripcion.push(lugar[0].nombre)
                  console.info(this.lugaresDescripcion)
                }
                else{
                  this.lugaresDescripcion.push("")
                }
                if(this.lugaresDescripcion.length == this.resenas.length){
                  suscripcion.unsubscribe()
                }                
              })
            }      
          }
        })
      }
    }
  }

  guardar() {
    if(!this.formulario.valid){
      Swal.fire({
        type: 'error',
        title: 'Error al guardar los cambios al perfil',
        text: 'Debe completar correctamente todos los campos'
      });
      return;
    }
    var suscripcion = this.datosService.obtenerColeccionCondicion("usuarios", "usuario", this.formulario.controls['usuario'].value).subscribe(usu=>{
      if(usu == undefined || (usu != undefined && usu.length == 0) || (usu != undefined && usu[0]["id"] == this.usuario.id)){
        this.usuario.nombre = this.formulario.get("nombre").value
        this.usuario.apellidos = this.formulario.get("apellidos").value
        this.usuario.correo = this.formulario.get("correo").value
        this.usuario.usuario = this.formulario.get("usuario").value
        this.usuario.usuario = this.usuario.usuario.toLowerCase()
        this.usuario.lugaresSeguidos = []
        for(var i in this.lugaresSeguidos){
          this.usuario.lugaresSeguidos.push(this.lugaresSeguidos[i].id)
        }
        this.datosService.actualizarElemento("usuarios", this.usuario).catch(err =>{
          Swal.fire({
            type: 'error',
            title: 'Error al guardar los cambios al perfil',
            text: err.message
          });
          suscripcion.unsubscribe()
        }).then(()=>{
          Swal.fire({
            type: 'success',
            title: 'Guardado correctamente'
          });
          this.auth.almacenarUsuarioLocalStorage(this.usuario.idFB)
          suscripcion.unsubscribe()
        });
      }
      else{
        Swal.fire({
          type: 'error',
          title: 'Error al guardar',
          text: 'Ya existe un usuario registrado con ese nombre de usuario'
        });
      }      
    })    
  }

  cargarImagen(e) {
    if(e.target.files.length != 0) {
      this.imagen.cargarImagen(e.target.files);
       
      var intervalo = setInterval(x =>{
        if(this.imagen.cambios){
          for(let x in this.imagen.imagenesSubidas){
            this.usuario.foto = this.imagen.imagenesSubidas[x];
          }
          this.imagen.cambios = false
          clearInterval(intervalo)
        }
      }, 1000)
    }
  }

  removerLugar(lugarId: number){
    Swal.fire({
      title: 'Estás seguro de eliminarlo?',
      text: "No podrás revertir esto!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        var suscLugar : Subscription;
        suscLugar = this.datosService.obtenerElementoId("lugares", lugarId.toString()).subscribe(datos => {
          if(datos){
            var lugar = <lugar> datos[0];
            var seguidores = []
            for(var i in lugar.seguidores){
                if(lugar.seguidores[i] != this.usuario.id){
                  seguidores.push(lugar.seguidores[i]);
                }
            }
            lugar.seguidores = seguidores;
            this.datosService.actualizarElemento("lugares", lugar).then(()=>{
              var lugaresSeguidosTemp = []
              for(let i in this.lugaresSeguidos){
                if(this.lugaresSeguidos[i].id != lugarId){
                  lugaresSeguidosTemp.push(this.lugaresSeguidos[i])
                }
              }
              this.lugaresSeguidos = lugaresSeguidosTemp
              this.usuario.lugaresSeguidos = []
              for(let i in this.lugaresSeguidos){
                this.usuario.lugaresSeguidos.push(this.lugaresSeguidos[i].id)
              } 
              this.datosService.actualizarElemento("usuarios", this.usuario).catch(err =>{
                Swal.fire({
                  type: 'error',
                  title: 'Error al dejar de seguir lugar',
                  text: err.message
                });
              }).then(()=>{
                this.auth.almacenarUsuarioLocalStorage(this.usuario.idFB)
              });
              suscLugar.unsubscribe();
            });        
          }
        });
      }
    })
  }

  ngOnDestroy(): void{
    if(this.suscUsuario){
      this.suscUsuario.unsubscribe();
    }
    if(this.suscResena){
      this.suscResena.unsubscribe();
    }
  }
}
