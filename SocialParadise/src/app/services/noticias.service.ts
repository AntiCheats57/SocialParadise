import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import { noticia } from '../interfaces/noticia';
import noticias from '../../assets/json/noticias.json';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortDirection} from '../directives/sortable.directive';

interface SearchResult {
  noticiasSorted: noticia[];
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

function sort(noticias: noticia[], column: string, direction: string): noticia[] {
  if (direction === '') {
    return noticias;
  } else {
    return [...noticias].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(noticias: noticia, term: string, pipe: PipeTransform) {
  return noticias.titulo.toLowerCase().includes(term)
    || noticias.contenido.toLowerCase().includes(term)
    || noticias.fechaCreacion.toLowerCase().includes(term);
    // || pipe.transform(noticias.creacion).includes(term);
}

@Injectable({providedIn: 'root'})
export class CountryService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _noticias$ = new BehaviorSubject<noticia[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 8,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  private noticiasItems: noticia[];

  constructor(private pipe: DecimalPipe) {
    this.noticiasItems = noticias;

    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._noticias$.next(result.noticiasSorted);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get countries$() { return this._noticias$.asObservable(); }
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

    // 1. sort
    let noticiasSorted = sort(this.noticiasItems, sortColumn, sortDirection);

    // 2. filter
    noticiasSorted = noticiasSorted.filter(noticia => matches(noticia, searchTerm, this.pipe));
    const total = noticiasSorted.length;

    // 3. paginate
    noticiasSorted = noticiasSorted.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({noticiasSorted, total});
  }
}