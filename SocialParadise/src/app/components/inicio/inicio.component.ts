import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { lugar } from 'src/app/interfaces/lugar.interface';
import { DatosService } from 'src/app/services/datos/datos.service';
import { Observable, Subscription } from 'rxjs';
import { AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit, OnDestroy {
  
  pagina = 1;
  cantidadPorPagina = 9;
  cantidadMaxima = 5;
  cantidadPaginas: number;
  suscripcion : Subscription;
  lugares: lugar[];   

  constructor(private router: Router, private datosService : DatosService) {
    this.cantidadPaginas = (((this.lugares != null? this.lugares.length : 1)/ this.cantidadPorPagina) * 10);
    this.suscripcion = null;
  }

  ngOnInit() {
    this.suscripcion = this.datosService.obtenerColeccion("lugares").subscribe(datos => {
      this.lugares = datos;
      this.cantidadPaginas = (((this.lugares != null? this.lugares.length : 1)/ this.cantidadPorPagina) * 10);
    });
  }

  verLugar(id: string): void{
    this.router.navigate(["lugar/", id]);
  }

  ngOnDestroy(): void{
    if(this.suscripcion){
      this.suscripcion.unsubscribe();
    }
  }
}
