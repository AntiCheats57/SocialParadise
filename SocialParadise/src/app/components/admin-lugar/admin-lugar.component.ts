import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { lugar } from 'src/app/interfaces/lugar.interface';
import { LugaresService } from 'src/app/services/lugares/lugares.service';
import { NgbdSortableHeader, SortEvent } from 'src/app/directives/sortable.directive';
import { usuario } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-admin-lugar',
  templateUrl: './admin-lugar.component.html',
  styleUrls: ['./admin-lugar.component.css'],
  providers: [LugaresService, DecimalPipe]
})

export class AdminLugarComponent implements OnInit {
  lugares$: Observable<lugar[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: LugaresService) {
    this.lugares$ = service.lugares$;
    this.total$ = service.total$;
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

  asignado(objeto: any) {
    if (objeto) {
      return "Sí";
    } else {
      return "No";
    }
  }

  usuario(lugar: lugar) {
    if (lugar.usuario) {
      return "";
    } 
    else {
      return "";
    }
  }

  ngOnInit() {
  }

}
