import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { lugar } from 'src/app/interfaces/lugar.interface';
import { LugaresService } from 'src/app/services/lugares/lugares.service';
import { NgbdSortableHeader, SortEvent } from 'src/app/directives/sortable.directive';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DatosService } from 'src/app/services/datos/datos.service';

@Component({
  selector: 'app-admin-lugar',
  templateUrl: './admin-lugar.component.html',
  styleUrls: ['./admin-lugar.component.css'],
  providers: [LugaresService, DecimalPipe]
})

export class AdminLugarComponent implements OnInit {
  lugares$: Observable<lugar[]>;
  total$: Observable<number>;
  editores: usuario[];

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: LugaresService, private datosService : DatosService) {
    this.lugares$ = service.lugares$;
    this.total$ = service.total$;
    this.cargarEditores();
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.ordenarColumna = column;
    this.service.ordenarDireccion = direction;
  }

  obtenerEditor(lugar: lugar) {
    var salida  = "-"
    if(this.editores && this.editores.length > 0){
      for(let i in this.editores){
        if(this.editores[i].id == lugar.usuario){
          salida = this.editores[i].nombre + " " + this.editores[i].apellidos
        }
      }
    }
    return salida;
  }

  ngOnInit() {
  }

  cargarEditores(){
    if(this.lugares$){
      this.lugares$.subscribe(datos => {
        this.editores = []
        if(datos && datos.length > 0){          
          for(let i in datos){
            if(datos[i].usuario >= 0){
              this.datosService.obtenerElementoId("usuarios", datos[i].usuario.toString()).subscribe(usu => {
                if(usu){
                  this.editores.push(<usuario> usu[0]);
                  //suscripcion.unsubscribe();
                }
              })
            }            
          }          
        }
      })
    }
  }

}
