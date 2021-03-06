import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { noticia } from 'src/app/interfaces/noticia.interface';
import { DatosService } from 'src/app/services/datos/datos.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  providers: [NgbCarouselConfig]
})

export class CarouselComponent implements OnInit, OnDestroy  {
  
  @Input() public tipoElemento: string;
  
  private showNavigationArrows = false;
  private showNavigationIndicators = false;
  private suscripcion : Subscription;
  private noticias : noticia[];
  private lugar : any;

  constructor(config: NgbCarouselConfig, private datosService : DatosService, private rutaActual: ActivatedRoute) {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = false;
  }

  ngOnInit() {
    if(this.tipoElemento){
      if(this.tipoElemento === 'noticias'){
        this.suscripcion = this.datosService.obtenerColeccion("noticias").subscribe(datos => {
          this.noticias = datos;
        });
      }
      else if(this.tipoElemento === 'lugar'){
        this.lugar = {
          "id": -1,
          "idFB":"",
          "nombre":"",
          "usuario":"",
          "video":"",
          "ubicacion":"",
          "descripcion":"",
          "seguidores":[],
          "resenas":[""],
          "imagenes":[""],
          "latitud": 0,
          "longitud": 0
        }
        this.suscripcion = this.datosService.obtenerElementoId("lugares", this.rutaActual.snapshot.paramMap.get("id")).subscribe(datos => {
            this.lugar = datos[0];
            if(this.lugar.imagenes.length == 0){
              this.lugar.imagenes.push("https://firebasestorage.googleapis.com/v0/b/socialparadiseuna.appspot.com/o/default%2Fpaisaje1.svg?alt=media&token=501ffcee-c3fd-4d8d-b748-40ea0ebe9019");
            }
          }, 
          error => {
        });
      }
    }
  }
  
  ngOnDestroy(): void{
    if(this.suscripcion){
      this.suscripcion.unsubscribe();
    }
  }

  esTipoElemento(tipoElemento: string): boolean{
    return this.tipoElemento === tipoElemento;
  }
}
