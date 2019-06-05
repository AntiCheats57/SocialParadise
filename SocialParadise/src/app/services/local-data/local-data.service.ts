import { Injectable } from '@angular/core';

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
        id : -1,
        idFB: "",
        foto : "",
        nombre : "",
        correo : "",
        usuario : ""
      }
    }
  }

  eliminarUsuarioActual(){
    localStorage.removeItem("usuario");
  }
}
