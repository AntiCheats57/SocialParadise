import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { noticia } from 'src/app/interfaces/noticia.interface';
import { NoticiasService } from 'src/app/services/noticias/noticias.service';
import { NgbdSortableHeader, SortEvent } from 'src/app/directives/sortable.directive';

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

  editar(object: noticia) {

    
  }

}
