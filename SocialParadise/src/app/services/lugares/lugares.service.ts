import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { lugar } from 'src/app/interfaces/lugar.interface';
import { DecimalPipe } from '@angular/common';
import { debounceTime , delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection } from 'src/app/directives/sortable.directive';
import { DatosService } from 'src/app/services/datos/datos.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { usuario } from 'src/app/interfaces/usuario.interface';

interface SearchResult {
  lugares: lugar[];
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

function ordenar(lugares: lugar[], columna: string, tipoOrden: string): lugar[] {
  if (tipoOrden === '') {
    return lugares;
  } else {
    return [...lugares].sort((a, b) => {
      const res = comparar(a[columna], b[columna]);
      return tipoOrden === 'asc' ? res : -res;
    });
  }
}

@Injectable({providedIn: 'root'})
export class LugaresService {
  private _cargando$ = new BehaviorSubject<boolean>(true);
  private _buscar$ = new Subject<void>();
  private _lugares$ = new BehaviorSubject<lugar[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private lugaresItems: lugar[] = [];

  private _estado: Estado = {
    pagina: 1,
    tamanoPagina: 4,
    buscarTermino: '',
    ordenarColumna: '',
    ordenarDireccion: ''
  };

  constructor(private pipe: DecimalPipe, private datosService: DatosService, private auth : AuthService, private localStorage : LocalDataService) {
    this.lugaresItems = []

    this.datosService.obtenerColeccion("lugares").subscribe(datos => {
      if(datos){
        this.lugaresItems = datos;
              
        this._buscar$.pipe(
          tap(() => this._cargando$.next(true)),
          debounceTime(200),
          switchMap(() => this._buscar()),
          delay(200),
          tap(() => this._cargando$.next(false))
        ).subscribe(resultado => {
          this._lugares$.next(resultado.lugares);
          this._total$.next(resultado.total);
        });
    
        this._buscar$.next();
      }
      else{
        this.lugaresItems = [];
      }
    });
  }

  get lugares$() { return this._lugares$.asObservable(); }
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

  private encontrar(lugar: lugar, termino: string, pipe: PipeTransform) {
    return lugar.nombre.toLowerCase().includes(termino.toLowerCase())
          || this.asignado(lugar).toLowerCase().includes(termino.toLowerCase());
          // || lugar.descripcion.toLowerCase().includes(termino);
  }
  
  private asignado(lugar: lugar): string {
    if (lugar.usuario) {
      return "Sí";
    } 
    else {
      return "No";
    }
  } 

  // private editor(lugar: lugar): string {
  //   if (lugar.usuario) {
  //     this.datosService.obtenerElementoId('usuario', lugar.usuario.toString()).subscribe(dato => {
  //       return dato.values.toString();
  //     });
  //     // return "";
  //   } 
  //   else {
  //     return "";
  //   }
    
  // } 
  

  private _set(patch: Partial<Estado>) {
    Object.assign(this._estado, patch);
    this._buscar$.next();
  }

  private _buscar(): Observable<SearchResult> {
    const {ordenarColumna, ordenarDireccion, tamanoPagina, pagina, buscarTermino} = this._estado;

    let lugares = ordenar(this.lugaresItems, ordenarColumna, ordenarDireccion);

    lugares = lugares.filter(lugare => this.encontrar(lugare, buscarTermino, this.pipe));
    const total = lugares.length;
    
    lugares = lugares.slice((pagina - 1) * tamanoPagina, (pagina - 1) * tamanoPagina + tamanoPagina);
    return of({lugares, total});
  }
}