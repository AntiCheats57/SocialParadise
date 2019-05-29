import {  Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { lugar } from 'src/app/interfaces/lugar.interface';
import { EditorService } from 'src/app/services/editor/editor.service';
import { NgbdSortableHeader, SortEvent } from 'src/app/directives/sortable.directive';

@Component({
  selector: 'app-admin-editor',
  templateUrl: './admin-editor.component.html',
  styleUrls: ['./admin-editor.component.css'],
  providers: [EditorService, DecimalPipe]
})

export class AdminEditorComponent implements OnInit {
  lugares$: Observable<lugar[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: EditorService) {
    this.lugares$ = service.lugares$;
    console.info(service.lugares$)
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

}
