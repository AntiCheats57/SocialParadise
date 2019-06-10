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
  private resenasTemp : resena[];
  private usuarios : any[];
  private usuarioActual : usuario;
  private refrescar : boolean;
  private lugarId : number;
  siguiendoLugar: boolean;
  lugar : any;
  resenas : resena[];
  censurar: boolean;

  constructor(public auth : AuthService, config: NgbRatingConfig, private localStorage : LocalDataService, private datosService : DatosService, private rutaActual: ActivatedRoute, private router: Router) {
    config.max = 5;
    config.readonly = true;
    this.refrescar = true;
    this.siguiendoLugar = false
    this.lugarId = parseInt(this.rutaActual.snapshot.paramMap.get("id"));
    this.censurar = false;
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
            var usuario = this.localStorage.obtenerUsuarioActual()
            if(this.auth.estaAutentificado() && usuario != null && usuario.id != -1){
              for(var seguidor in this.lugar.seguidores){          
                if(this.lugar.seguidores[seguidor] == usuario.id){
                  this.siguiendoLugar = true
                }
              }
            }
            this.suscResena = this.datosService.obtenerColeccionCondicion("resenas", "lugar", parseInt(this.lugar.id)).subscribe(elementos => {
              this.resenasTemp = elementos;
              this.resenas = []
              this.usuarios = []    
              if(this.resenasTemp != undefined){                
                this.valoracionGeneral = 0;
                var cantidadResenas = 0;
                this.resenasTemp.sort((x, y) => {
                  return -1 * ((new Date(x.fechaPublicacion)).getTime() - (new Date(y.fechaPublicacion)).getTime())

                }).forEach(r => {
                  if(r.lugar === this.lugar.id){
                    this.valoracionGeneral = this.valoracionGeneral + r.valoracion;
                    cantidadResenas++;   
                    if((this.auth.estaAutentificado() && this.auth.esAdmin()) || !r.censurado){         
                      this.resenas.push(r); 
                      this.suscUsuario = this.datosService.obtenerElementoId("usuarios", r.usuario.toString()).subscribe(usu => {
                          if(usu != undefined){
                            this.usuarios.push({
                              nombre: (<usuario> usu[0]).nombre + " " + (<usuario> usu[0]).apellidos, 
                              id: (<usuario> usu[0]).id,
                              foto: (<usuario> usu[0]).foto
                            });
                          }
                      }, error => {}, ()=> {this.suscUsuario.unsubscribe()});
                    }
                  }              
                });     
                this.valoracionGeneral = this.valoracionGeneral / (cantidadResenas != 0? cantidadResenas : 1);  
              }
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

  cambiarCensuraResena(indice : number){
      if(this.resenas && this.resenas[indice]){
        this.resenas[indice].censurado = !this.resenas[indice].censurado;
        this.datosService.actualizarElemento("resenas", this.resenas[indice]);
      }
  }

}
