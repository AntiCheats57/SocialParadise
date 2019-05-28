import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { lugar } from 'src/app/interfaces/lugar.interface';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection } from 'src/app/directives/sortable.directive';

interface SearchResult {
  lugaresSorted: lugar[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(countries: lugar[], column: string, direction: string): lugar[] {
  if (direction === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(lugares: lugar, term: string, pipe: PipeTransform) {
  return lugares.nombre.toLowerCase().includes(term)
    || lugares.descripcion.toLowerCase().includes(term);
}

@Injectable({providedIn: 'root'})
export class LugaresService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _lugares$ = new BehaviorSubject<lugar[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 8,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  private lugaresItems: lugar[];

  constructor(private pipe: DecimalPipe) {
    //this.lugaresItems = lugares;

    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._lugares$.next(result.lugaresSorted);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get lugares$() { return this._lugares$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    let lugaresSorted = sort(this.lugaresItems, sortColumn, sortDirection);

    lugaresSorted = lugaresSorted.filter(lugar => matches(lugar, searchTerm, this.pipe));
    const total = lugaresSorted.length;

    lugaresSorted = lugaresSorted.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({lugaresSorted, total});
  }
}
