import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable } from 'rxjs';
import { DatosService } from 'src/app/services/datos/datos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { resena } from 'src/app/interfaces/resena.interface';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { lugar } from 'src/app/interfaces/lugar.interface';

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
  private refrescar : boolean;
  private refrescar2 : boolean;

  constructor(config: NgbRatingConfig, private datosService : DatosService, private rutaActual: ActivatedRoute, private router: Router) {
    config.max = 5;
    config.readonly = true;
    this.refrescar = true;
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
    this.suscripcionLugar = this.datosService.obtenerElementoId("lugares", this.rutaActual.snapshot.paramMap.get("id")).subscribe(datos => {
        if(this.refrescar){
          if(datos[0] != undefined){
            this.lugar = datos[0];
            this.suscripcionResena = this.datosService.obtenerColeccion("resenas").subscribe(elementos => {
              this.resenas = elementos;
              if(this.resenas != undefined){                
                this.valoracionGeneral = 0;
                var cantidadResenas = 0;
                this.resenas.forEach(r => {
                  if(r.lugar === this.lugar.id){
                    this.valoracionGeneral = this.valoracionGeneral + r.valoracion;
                    cantidadResenas++;                  
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

  getNombre(usuarioId: string){
    var nombre = null;
    this.refrescar2 = true;
    this.suscripcionUsuario = this.datosService.obtenerElementoId("usuarios", usuarioId).subscribe(datos => {
        if(nombre == null && datos != undefined && this.refrescar2){
          nombre = (<usuario> datos[0]).nombre + " " + (<usuario> datos[0]).apellidos
          this.refrescar2 = false;
        }
    });
    return nombre;
  }

}
