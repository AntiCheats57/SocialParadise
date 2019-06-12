import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable } from 'rxjs';
import { DatosService } from 'src/app/services/datos/datos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { resena } from 'src/app/interfaces/resena.interface';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-lugar-turistico',
  templateUrl: './lugar-turistico.component.html',
  styleUrls: ['./lugar-turistico.component.css'],
  providers: [NgbRatingConfig]
})


export class LugarTuristicoComponent implements OnInit, OnDestroy {
  
  valoracionGeneral: number;
  private suscLugar : Subscription;
  private suscResena : Subscription;
  private suscUsuario : Subscription;
  private suscUsuarioActual : Subscription;
  private suscSeguir : Subscription;
  private resenasFiltradas : resena[];
  private respuestasFiltradas: resena[];
  private respuestas : resena[];
  private usuarios : any[];
  private usuarioActual : usuario;
  private refrescar : boolean;
  private lugarId : number;
  private obtenerSeguidor : boolean;  
  siguiendoLugar: boolean;
  lugar : any;
  resenas : resena[];
  censurar: boolean;
  seguidores: any[];
  formulario: FormGroup;
  resenaComentario: resena;
  esDueno: boolean;

  constructor(public auth : AuthService, config: NgbRatingConfig, private localStorage : LocalDataService, private datosService : DatosService, private rutaActual: ActivatedRoute, private router: Router) {
    this.formulario = new FormGroup({
      'comentario': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(2)
                                  ])
    });    
    this.formulario.setValue({comentario : ""});
    config.max = 5;
    config.readonly = true;
    this.refrescar = true;
    this.siguiendoLugar = false
    this.lugarId = parseInt(this.rutaActual.snapshot.paramMap.get("id"));
    this.censurar = false;
    this.esDueno = false;
    this.seguidores = []
  }

  ngOnInit() {
    this.lugar = {
      id: -1,
      idFB:"",
      nombre:"",
      usuario:"",
      video:"",
      ubicacion:"",
      descripcion:"",
      seguidores:[],
      imagenes:[""]
    }
    this.suscLugar = this.datosService.obtenerElementoId("lugares", this.lugarId.toString()).subscribe(datos => {
        if(this.refrescar){
          if(datos[0] != undefined){
            this.lugar = datos[0];
            this.obtenerSeguidores();
            var usuario = this.localStorage.obtenerUsuarioActual()
            if(this.auth.estaAutentificado() && usuario != null && usuario.id != -1){
              for(var seguidor in this.lugar.seguidores){          
                if(this.lugar.seguidores[seguidor] == usuario.id){
                  this.siguiendoLugar = true
                }
              }
              this.datosService.obtenerElementoIdFB("usuarios", usuario.idFB).subscribe(datos => {
                if(datos){
                  for(let i in datos["lugaresAsignados"]){
                    if(datos["lugaresAsignados"][i] == this.lugar.id){
                      this.esDueno = true;
                    }      
                  }
                  if(this.esDueno){
                    this.esDueno = this.lugar.usuario == datos["id"]
                  }
                }
                else{
                  this.esDueno = false;
                }
              }) 
            }
            this.suscResena = this.datosService.obtenerColeccionCondicion("resenas", "lugar", parseInt(this.lugar.id)).subscribe(elementos => {
              var resenasTemp = elementos;
              this.resenasFiltradas = []
              this.respuestasFiltradas = []
              this.respuestas = []
              this.resenas = []
              this.usuarios = []                

              for(let i in resenasTemp){
                  if(resenasTemp[i].tipo == "C"){
                      this.resenasFiltradas.push(resenasTemp[i]);
                  }
                  else if(resenasTemp[i].tipo == "R"){
                    this.respuestasFiltradas.push(resenasTemp[i]);
                  }
              }
              this.respuestasFiltradas.sort((x,y) => {
                return -1 * ((new Date(x.fechaPublicacion)).getTime() - (new Date(y.fechaPublicacion)).getTime())
              }).forEach(r => {
                if(r.lugar === this.lugar.id){
                  if((this.auth.estaAutentificado() && this.esDueno) || !r.censurado){         
                    this.respuestas.push(r); 
                    if(r.usuario){
                      var yaConsultado = false;
                      for(let i in this.usuarios){
                        if(this.usuarios[i].id == r.usuario){
                          yaConsultado = true;
                          break;
                        }
                      }
                      if(!yaConsultado){
                        this.suscUsuario = this.datosService.obtenerElementoId("usuarios", r.usuario.toString()).subscribe(usu => {
                            if(usu != undefined && usu[0] != undefined){
                              this.usuarios.push({
                                nombre: (<usuario> usu[0]).nombre + " " + (<usuario> usu[0]).apellidos, 
                                id: (<usuario> usu[0]).id,
                                foto: (<usuario> usu[0]).foto
                              });
                            }
                        }, error => {}, ()=> {this.suscUsuario.unsubscribe()});
                      }
                    }
                  }
                }              
              });              
              this.valoracionGeneral = 0;
              var cantidadResenas = 0;
              this.resenasFiltradas.sort((x, y) => {
                return -1 * ((new Date(x.fechaPublicacion)).getTime() - (new Date(y.fechaPublicacion)).getTime())

              }).forEach(r => {
                if(r.lugar === this.lugar.id){
                  this.valoracionGeneral = this.valoracionGeneral + r.valoracion;
                  cantidadResenas++;   
                  if((this.auth.estaAutentificado() && this.esDueno) || !r.censurado){         
                    this.resenas.push(r); 
                    if(r.usuario){
                      var yaConsultado = false;
                      for(let i in this.usuarios){
                        if(this.usuarios[i].id == r.usuario){
                          yaConsultado = true;
                          break;
                        }
                      }
                      if(!yaConsultado){
                        this.suscUsuario = this.datosService.obtenerElementoId("usuarios", r.usuario.toString()).subscribe(usu => {
                            if(usu != undefined && usu[0] != undefined){
                              this.usuarios.push({
                                nombre: (<usuario> usu[0]).nombre + " " + (<usuario> usu[0]).apellidos, 
                                id: (<usuario> usu[0]).id,
                                foto: (<usuario> usu[0]).foto
                              });
                            }
                        }, error => {}, ()=> {this.suscUsuario.unsubscribe()});
                      }
                    }
                  }
                }              
              }); 
              this.valoracionGeneral = this.valoracionGeneral / (cantidadResenas != 0? cantidadResenas : 1);  
            });
          }
          else{
            this.router.navigate(["/"]);          
          }   
        }
      }, err => {
        console.info("Error al obtener el elemento");
        this.router.navigate(["/"]);
      }
   );  
   if(this.auth.estaAutentificado()){
      var usuarioActualId = this.localStorage.obtenerUsuarioActual()["id"];
      if(usuarioActualId >= 0){
        this.suscUsuarioActual = this.datosService.obtenerElementoId("usuarios", usuarioActualId).subscribe(datos => {
          if(datos){
            this.usuarioActual = <usuario> datos[0]
          }
        }) 
      }
    }
  }

  ngOnDestroy(): void{
    if(this.suscLugar){
      this.suscLugar.unsubscribe();
    }
    if(this.suscResena){
      this.suscResena.unsubscribe();      
    }
    if(this.suscUsuario){
      this.suscUsuario.unsubscribe();      
    }
    if(this.suscSeguir){
      this.suscSeguir.unsubscribe();      
    }
    if(this.suscUsuarioActual){
      this.suscUsuarioActual.unsubscribe();      
    }
  }

  getAtributoUsuario(usuarioId: number, atributo : string): string {
    var salida = "";
    if(this.usuarios){
      this.usuarios.forEach(x => {
        if(x.id == usuarioId){
          switch(atributo){
            case "nombre":
                salida = x.nombre;
              break;
            case "foto":
                salida = x.foto;
              break;
          }          
        }
      });
    }
    return salida;
  }

  modificarSeguimientoLugar(){
    if(!this.auth.estaAutentificado()){
      this.router.navigate(["/loguearse"])
    }
    this.suscSeguir = this.datosService.obtenerElementoId("lugares", this.lugarId.toString()).subscribe(datos => {
        if(datos != undefined){
          if(datos[0]["seguidores"] === undefined){
            datos[0]["seguidores"] = [];
          }
          var usuarioActualId = this.usuarioActual.id;
          if(this.siguiendoLugar){
            this.lugar.seguidores = []
            for(var seguidor in datos[0]["seguidores"]){
              if(datos[0]["seguidores"][seguidor] != usuarioActualId){
                (<number[]> this.lugar.seguidores).push(parseInt(datos[0]["seguidores"][seguidor]))
              }
            }
            var lugaresSeguidos = []
            for(var lugar in this.usuarioActual["lugaresSeguidos"]){
              if(this.usuarioActual["lugaresSeguidos"][lugar]  != this.lugar.id){
                lugaresSeguidos.push(this.usuarioActual["lugaresSeguidos"][lugar])
              }
            }
            this.usuarioActual["lugaresSeguidos"] = lugaresSeguidos
            this.siguiendoLugar = false;  
          }
          else{
            this.usuarioActual["lugaresSeguidos"].push(this.lugar.id);
            this.lugar.seguidores = (<number[]> datos[0]["seguidores"]);
            this.lugar.seguidores.push(usuarioActualId);
            this.siguiendoLugar = true;
          }
          this.datosService.actualizarElemento("lugares", this.lugar)
          this.datosService.actualizarElemento("usuarios", this.usuarioActual)
          this.suscSeguir.unsubscribe();      
        }
    }, error =>{}, () =>{});
    
  }

  obtenerRespuestasResena(resenaIndice: number){
    var salida = []
    if(this.respuestas){
      for(let i in this.resenas[resenaIndice].respuestas){
        for(let j in this.respuestas){
          if(this.resenas[resenaIndice].respuestas[i] == this.respuestas[j].id){
            salida.push(this.respuestas[j]);
            break;
          }
        }
      }
    }
    return salida;
  }

  obtenerSeguidores(){
    if(this.lugar.seguidores){
      this.seguidores = []
      for(let i in this.lugar.seguidores){
        var suscripcion = this.datosService.obtenerElementoId("usuarios", this.lugar.seguidores[i].toString()).subscribe(seg => {
            if(seg && seg.length > 0){
              var yaConsultado = false;
              for(let i in this.seguidores){
                if(this.seguidores[i].id == (<usuario> seg[0]).id){
                  yaConsultado = true;
                }
              }
              if(!yaConsultado){ 
                var seguidor = false;               
                for(let i in seg[0]["lugaresSeguidos"]){
                  if(seg[0]["lugaresSeguidos"][i] == this.lugar.id){
                    seguidor = true;                
                  }
                }
                if(seguidor){
                  this.seguidores.push({
                    id: (<usuario> seg[0]).id,
                    nombre: (<usuario> seg[0]).nombre + " " + (<usuario> seg[0]).apellidos,
                    foto: (<usuario> seg[0]).foto,
                    correo: (<usuario> seg[0]).correo                     
                  })
                }
              }
            }
        }, error => {}, ()=> {suscripcion.unsubscribe()});
      }
    }
  }

  eliminar(resenaIndice : number, respuestaId : number, resenaTipo : string){
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
      if(result.value) {
        if(resenaTipo === 'C'){
          if(this.resenas[resenaIndice]){
            this.datosService.eliminarElemento("resenas", this.resenas[resenaIndice].idFB).catch(err =>{
              Swal.fire({
                type: 'error',
                title: 'Error al eliminar el comentario',
                text: err.message
              });
            }).then(()=>{
              Swal.fire({
                type: 'success',
                title: 'El comentario se eliminó correctamente'
              });
            });   
          }
        }
        else if(resenaTipo === 'R'){
          var resenaRespuestas = this.obtenerRespuestasResena(resenaIndice);
          if(resenaRespuestas && resenaRespuestas.length > 0){
            var respuestaIndice = -1;
            for(let i in resenaRespuestas){
              if(resenaRespuestas[i].id == respuestaId){
                respuestaIndice = parseInt(i);
              }
            }
            if(respuestaIndice != -1){
              this.datosService.eliminarElemento("resenas", resenaRespuestas[respuestaIndice].idFB).catch(err =>{
                Swal.fire({
                  type: 'error',
                  title: 'Error al eliminar la respuesta',
                  text: err.message
                });
              }).then(()=>{
                Swal.fire({
                  type: 'success',
                  title: 'La respuesta se eliminó correctamente'
                });
              });  
            }
          }
        }
      }
    });
  }

  cambiarCensuraResena(resenaId : number){
      if(this.resenas){
        for(let i in this.resenas){
          if(this.resenas[i].id == resenaId){
            this.resenas[i].censurado = !this.resenas[i].censurado;
            this.datosService.actualizarElemento("resenas", this.resenas[i]).catch(err =>{
              Swal.fire({
                type: 'error',
                title: 'Error al cambiar estado de censura',
                text: err.message
              });
              return;
            }).then(()=>{
              return;
            });
          }
        }
      }
      if(this.respuestas){
        for(let i in this.respuestas){
          if(this.respuestas[i].id == resenaId){
            this.respuestas[i].censurado = !this.respuestas[i].censurado;
            this.datosService.actualizarElemento("resenas", this.respuestas[i]).catch(err =>{
              Swal.fire({
                type: 'error',
                title: 'Error al cambiar estado de censura',
                text: err.message
              });
              return;
            }).then(()=>{
              return;
            });
          }
        }
      }
  }

  comentar(resena : resena, resenaId: string){
    this.validar();
    if(!this.formulario.valid){
      Swal.fire({
        type: 'error',
        title: 'Error al comentar',
        text: 'Debe completar correctamente todos los campos'
      });
      return;
    }    
    this.resenaComentario = {      
      id: -1,
      idFB: "",
      lugar: this.lugarId,
      usuario: this.usuarioActual.id,
      valoracion: 0,
      comentario: this.formulario.get("comentario").value,
      fechaPublicacion: formatDate(Date.now(), "MM/dd/yyyy hh:mm a", "en-US"), 
      censurado: false,
      tipo: "R",
      respuestas: []
    }

    var comentar = true;
    this.datosService.obtenerUltimoId("resenas").then(datos => {
      if(datos != undefined && datos.docs[0] != undefined){
        this.resenaComentario.id = (<resena> datos.docs[0].data()).id + 1
      }
      else{
        this.resenaComentario.id = 0
      }   
      if(comentar){
        this.datosService.insertarElemento("resenas", this.resenaComentario, true).catch(err => {
          Swal.fire({
            type: 'error',
            title: 'Error al guardar comentario',
            text: err.message
          });
        }).then(()=> {
          resena.respuestas.push(this.resenaComentario.id);
          this.datosService.actualizarElemento("resenas", resena).catch(err => {
            Swal.fire({
              type: 'error',
              title: 'Error al guardar comentario',
              text: err.message
            });
          }).then(()=>{
            Swal.fire({
              type: 'success',
              title: 'Comentario guardado correctamente'
            });
          })
        });
        comentar = false;
        
        this.cerrarModal(resenaId);
      }

    });
  }

  cerrarModal(resenaId: string) {
    $(document).ready(function() {
      $(resenaId).modal("hide");
    });
    this.formulario.reset();
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
}
