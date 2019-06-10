import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { debounceTime , delay, switchMap, tap } from 'rxjs/operators';
import { DatosService } from 'src/app/services/datos/datos.service';

interface SearchResult {
  usuarios: usuario[];
  total: number;
}

interface Estado {
  buscarTermino: string;
}

function encontrar(usuario: usuario, termino: string) {
  return usuario.nombre.toLowerCase().includes(termino.toLowerCase())
         || usuario.apellidos.toLowerCase().includes(termino.toLowerCase())
         || usuario.correo.toLowerCase().includes(termino.toLowerCase());
}

@Injectable({providedIn: 'root'})
export class UsuariosService {
  private _cargando$ = new BehaviorSubject<boolean>(true);
  private _buscar$ = new Subject<void>();
  private _usuarios$ = new BehaviorSubject<usuario[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private usuariosItems: usuario[] = [];

  private _estado: Estado = {
    buscarTermino: ''
  };

  constructor(private datosService: DatosService) {
    this.usuariosItems = []
    this.datosService.obtenerColeccion("usuarios").subscribe(datos => {
      if(datos){
        this.usuariosItems = datos;
        this._buscar$.pipe(
          tap(() => this._cargando$.next(true)),
          debounceTime(200),
          switchMap(() => this._buscar()),
          delay(200),
          tap(() => this._cargando$.next(false))
        ).subscribe(resultado => {
          this._usuarios$.next(resultado.usuarios);
          this._total$.next(resultado.total);
        });
    
        this._buscar$.next();
      }
      else{
        this.usuariosItems = [];
      }
    });
  }

  get usuarios$() { return this._usuarios$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get cargando$() { return this._cargando$.asObservable(); }
  get buscarTermino() { return this._estado.buscarTermino; }

  set buscarTermino(buscarTermino: string) { this._set({buscarTermino}); }

  private _set(patch: Partial<Estado>) {
    Object.assign(this._estado, patch);
    this._buscar$.next();
  }

  private _buscar(): Observable<SearchResult> {
    const {buscarTermino} = this._estado;

    let usuarios = this.usuariosItems;
    
    usuarios = usuarios.filter(usuario => encontrar(usuario, buscarTermino));
    const total = usuarios.length;

    return of({usuarios, total});
  }
}
