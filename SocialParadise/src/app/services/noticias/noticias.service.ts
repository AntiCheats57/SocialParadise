import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { noticia } from 'src/app/interfaces/noticia.interface';
import { DecimalPipe } from '@angular/common';
import { debounceTime , delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection } from 'src/app/directives/sortable.directive';
import { DatosService } from 'src/app/services/datos/datos.service';

interface SearchResult {
  noticias: noticia[];
  total: number;
}

interface Estado {
  pagina: number;
  tamanoPagina: number;
  buscarTermino: string;
  ordenarColumna: string;
  ordenarDireccion: SortDirection;
}

function comparar(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function ordenar(noticias: noticia[], columna: string, tipoOrden: string): noticia[] {
  if (tipoOrden === '') {
    return noticias;
  } else {
    return [...noticias].sort((a, b) => {
      const res = comparar(a[columna], b[columna]);
      return tipoOrden === 'asc' ? res : -res;
    });
  }
}

function encontrar(noticia: noticia, termino: string, pipe: PipeTransform) {
  return noticia.titulo.toLowerCase().includes(termino.toLowerCase())
        || noticia.contenido.toLowerCase().includes(termino.toLowerCase())
        || noticia.fechaCreacion.toLowerCase().includes(termino.toLowerCase());
}

@Injectable({providedIn: 'root'})
export class NoticiasService {
  private _cargando$ = new BehaviorSubject<boolean>(true);
  private _buscar$ = new Subject<void>();
  private _noticias$ = new BehaviorSubject<noticia[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private noticiasItems: noticia[] = [];

  private _estado: Estado = {
    pagina: 1,
    tamanoPagina: 4,
    buscarTermino: '',
    ordenarColumna: '',
    ordenarDireccion: ''
  };

  constructor(private pipe: DecimalPipe, private datosService: DatosService) {
    this.noticiasItems = []
    this.datosService.obtenerColeccion("noticias").subscribe(datos => {
      if(datos){
        this.noticiasItems = datos;
        this._buscar$.pipe(
          tap(() => this._cargando$.next(true)),
          debounceTime(200),
          switchMap(() => this._buscar()),
          delay(200),
          tap(() => this._cargando$.next(false))
        ).subscribe(resultado => {
          this._noticias$.next(resultado.noticias);
          this._total$.next(resultado.total);
        });
    
        this._buscar$.next();
      }
      else{
        this.noticiasItems = [];
      }
    });
  }

  get noticias$() { return this._noticias$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get cargando$() { return this._cargando$.asObservable(); }
  get pagina() { return this._estado.pagina; }
  get tamanoPagina() { return this._estado.tamanoPagina; }
  get buscarTermino() { return this._estado.buscarTermino; }

  set pagina(pagina: number) { this._set({pagina}); }
  set tamanoPagina(tamanoPagina: number) { this._set({tamanoPagina}); }
  set buscarTermino(buscarTermino: string) { this._set({buscarTermino}); }
  set ordenarColumna(ordenarColumna: string) { this._set({ordenarColumna}); }
  set ordenarDireccion(ordenarDireccion: SortDirection) { this._set({ordenarDireccion}); }

  private _set(patch: Partial<Estado>) {
    Object.assign(this._estado, patch);
    this._buscar$.next();
  }

  private _buscar(): Observable<SearchResult> {
    const {ordenarColumna, ordenarDireccion, tamanoPagina, pagina, buscarTermino} = this._estado;

    let noticias = ordenar(this.noticiasItems, ordenarColumna, ordenarDireccion);

    noticias = noticias.filter(noticia => encontrar(noticia, buscarTermino, this.pipe));
    const total = noticias.length;
    
    noticias = noticias.slice((pagina - 1) * tamanoPagina, (pagina - 1) * tamanoPagina + tamanoPagina);
    return of({noticias, total});
  }
}
