import { Injectable } from '@angular/core';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private usuarioActual: usuario;

  constructor(private localDataService: LocalDataService) {
    this.localDataService.cargarDatos();
  }

  autentificarse(usuario: string, clave: string): boolean {
    this.usuarioActual = null;
    if (localStorage.getItem("usuarios") == null) {
      this.localDataService.cargarDatos();
    }
    for (let i of <usuario[]> JSON.parse(localStorage.getItem("usuarios"))) {;
      if (i.usuario === usuario && i.clave === clave) {
        this.usuarioActual = i;
        localStorage.setItem("usuario", JSON.stringify(this.usuarioActual));
      }
    }
    return this.usuarioActual != null;
  }

  estaAutentificado(): boolean{
    this.usuarioActual = null;
    if (localStorage.getItem("usuario") != null) {
      this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    }
    return this.usuarioActual != null;
  }
  
  getRol(): string{
    let salida: string = "normal";
    if (this.estaAutentificado()) {
      if (this.esAdmin()) {
        salida = "admin";
      }
      else if (this.esEditor()) {
        salida = "editor";
      }
    }
    else {
      salida = "nulo";
    }
    return salida;
  }

  esAdmin(): boolean {
    return this.estaAutentificado() && this.usuarioActual.admin === "S";
  }

  esEditor(): boolean {
    return this.estaAutentificado() && this.usuarioActual.lugaresAsignados != null && (this.usuarioActual.lugaresAsignados.length > 0);
  }

  cerrarSesion(): void{
    localStorage.setItem("usuario", null);
    this.usuarioActual = null;
  }

}
