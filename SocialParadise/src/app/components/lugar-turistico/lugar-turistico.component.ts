import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable } from 'rxjs';
import { DatosService } from 'src/app/services/datos/datos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { resena } from 'src/app/interfaces/resena.interface';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { usuario } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-lugar-turistico',
  templateUrl: './lugar-turistico.component.html',
  styleUrls: ['./lugar-turistico.component.css'],
  providers: [NgbRatingConfig]
})


export class LugarTuristicoComponent implements OnInit, OnDestroy {
  
  private valoracionGeneral: number;
  private suscripcionLugar : Subscription;
  private suscripcionResena : Subscription;
  private suscripcionUsuario : Subscription;
  private lugar : any;
  private resenas : resena[];
  private resenasTemp : resena[];
  private usuarios : any[]
  private refrescar : boolean;
  private lugarId : number;

  constructor(config: NgbRatingConfig, private datosService : DatosService, private rutaActual: ActivatedRoute, private router: Router) {
    config.max = 5;
    config.readonly = true;
    this.refrescar = true;
    this.lugarId = parseInt(this.rutaActual.snapshot.paramMap.get("id"));
  }

  ngOnInit() {
    this.lugar = {
      "id": 0,
      "idFB":"",
      "nombre":"",
      "usuario":"",
      "video":"",
      "ubicacion":"",
      "descripcion":"",
      "seguidores":[],
      "imagenes":[""]
    }
    this.suscripcionLugar = this.datosService.obtenerElementoId("lugares", this.lugarId.toString()).subscribe(datos => {
        if(this.refrescar){
          if(datos[0] != undefined){
            this.lugar = datos[0];
            this.suscripcionResena = this.datosService.obtenerColeccion("resenas").subscribe(elementos => {
              this.resenasTemp = elementos;
              this.resenas = []
              if(this.resenas != undefined){                
                this.valoracionGeneral = 0;
                var cantidadResenas = 0;
                this.resenasTemp.sort((x, y) => {
                  return -1 * ((new Date(x.fechaPublicacion)).getTime() - (new Date(y.fechaPublicacion)).getTime())

                }).forEach(r => {
                  if(r.lugar === this.lugar.id){
                    this.resenas.push(r)
                    this.valoracionGeneral = this.valoracionGeneral + r.valoracion;
                    cantidadResenas++;     
                    this.usuarios = []             
                    this.suscripcionUsuario = this.datosService.obtenerElementoId("usuarios", r.usuario.toString()).subscribe(usu => {
                      if(datos != undefined){
                        this.usuarios.push({
                          nombre: (<usuario> usu[0]).nombre + " " + (<usuario> usu[0]).apellidos, 
                          id: (<usuario> usu[0]).id,
                          foto: (<usuario> usu[0]).foto
                        });
                      }
                  }, error => {}, ()=> {this.suscripcionUsuario.unsubscribe()});
                  }              
                });        
                this.valoracionGeneral = this.valoracionGeneral / (cantidadResenas != 0? cantidadResenas : 1);  
              }
              this.refrescar = false;
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
  }

  ngOnDestroy(): void{
    if(this.suscripcionLugar){
      this.suscripcionLugar.unsubscribe();
    }
    if(this.suscripcionResena){
      this.suscripcionResena.unsubscribe();      
    }
    if(this.suscripcionUsuario){
      this.suscripcionUsuario.unsubscribe();      
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

}
