import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LocalDataService {

  constructor() {
  }

  agregarDatosSesion(sesion: any){
    localStorage.setItem("ds", JSON.stringify(sesion));
  }

  obtenerDatosSesion(): any{
    if(localStorage.getItem("ds")){
      return JSON.parse(localStorage.getItem("ds"));
    }
    else{
      return null;
    }
  }

  eliminarDatosSesion(){    
    localStorage.removeItem("ds");
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
