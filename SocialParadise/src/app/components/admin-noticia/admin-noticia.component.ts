import { Component, OnInit,QueryList, ViewChildren } from '@angular/core';
import {DecimalPipe} from '@angular/common';

import {Observable} from 'rxjs';

import {Noticias} from '../../models/noticias.model';
import {CountryService} from '../../services/noticias.service';
import {NgbdSortableHeader, SortEvent} from '../../directives/sortable.directive';


@Component({
  selector: 'app-admin-noticia',
  templateUrl: './admin-noticia.component.html',
  styleUrls: ['./admin-noticia.component.css'],
  providers: [CountryService, DecimalPipe]
})
export class AdminNoticiaComponent implements OnInit {

  noticias$: Observable<Noticias[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: CountryService) {
    this.noticias$ = service.countries$;
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
