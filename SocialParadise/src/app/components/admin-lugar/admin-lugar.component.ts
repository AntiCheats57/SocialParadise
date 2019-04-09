import { Component, OnInit,QueryList, ViewChildren } from '@angular/core';
import {DecimalPipe} from '@angular/common';

import {Observable} from 'rxjs';

import {lugar} from '../../interfaces/lugar.interface';
import {LugaresService} from '../../services/Lugares.service';
import {NgbdSortableHeader, SortEvent} from '../../directives/sortable.directive';


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
      // resetting other headers
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });
  
      this.service.sortColumn = column;
      this.service.sortDirection = direction;
    }
  ngOnInit() {
  }

}
