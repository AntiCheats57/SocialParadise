import { Component, OnInit, OnDestroy,QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { lugar } from 'src/app/interfaces/lugar.interface';
import { DatosService } from 'src/app/services/datos/datos.service';
import { Observable, Subscription } from 'rxjs';
import { AngularFireList } from 'angularfire2/database';
import { BuscarService } from 'src/app/services/buscar/buscar.service';
import { DecimalPipe } from '@angular/common';
import { noticia } from 'src/app/interfaces/noticia.interface';
import { NoticiasService } from 'src/app/services/noticias/noticias.service';
import { NgbdSortableHeader, SortEvent } from 'src/app/directives/sortable.directive';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  providers: [BuscarService, DecimalPipe]
})

export class InicioComponent implements OnInit, OnDestroy {
  
  pagina = 1;
  cantidadPorPagina = 9;
  cantidadMaxima = 5;
  cantidadPaginas: number;
  suscripcion : Subscription;
  lugares: lugar[];   

  lugares$: Observable<lugar[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(private router: Router, private datosService : DatosService, public service: BuscarService) {
    this.cantidadPaginas = (((this.lugares != null? this.lugares.length : 1)/ this.cantidadPorPagina) * 10);
    this.suscripcion = null;
    this.lugares$ = service.lugares$;
    this.total$ = service.total$; 
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
