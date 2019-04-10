import { Component, OnInit,QueryList, ViewChildren } from '@angular/core';
import {DecimalPipe} from '@angular/common';

import {Observable} from 'rxjs';

import {noticia} from '../../interfaces/noticia.interface';
import {NoticiasService} from '../../services/noticias.service';
import {NgbdSortableHeader, SortEvent} from '../../directives/sortable.directive';


@Component({
  selector: 'app-admin-noticia',
  templateUrl: './admin-noticia.component.html',
  styleUrls: ['./admin-noticia.component.css'],
  providers: [NoticiasService, DecimalPipe]
})
export class AdminNoticiaComponent implements OnInit {

  noticias$: Observable<noticia[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: NoticiasService) {
    this.noticias$ = service.noticias$;
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

  onClickMe(object:noticia) {
    // console.log(object);
  }
  
}
