import { Injectable } from '@angular/core';
import usuarios from 'src/assets/json/usuarios.json';
import noticias from 'src/assets/json/noticias.json';
import lugares from 'src/assets/json/lugares.json';
import resenas from 'src/assets/json/usuarios.json';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { noticia } from 'src/app/interfaces/noticia.interface.js';
import { resena } from 'src/app/interfaces/resena.interface.js';
import { lugar } from 'src/app/interfaces/lugar.interface.js';

@Injectable({
  providedIn: 'root'
})

export class LocalDataService {

  constructor() {
  }

  agregarUsuarioActual(usuario: any){
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }

  obtenerUsuarioActual(): any {
    if(localStorage.getItem("usuario")){
      return JSON.parse(localStorage.getItem("usuario"));
    }
    else{
      return {
        id : 0,
        idFB: "",
        foto : "",
        nombre : "",
        correo : "",
        usuario : ""
      }
    }
  }
}
