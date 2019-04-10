import { Injectable } from '@angular/core';
import { usuario } from '../interfaces/usuario.interface';
import usuarios from '../../assets/json/usuarios.json'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private usuarioActual: usuario;  
  private usuariosJson: usuario[];

  constructor() { 
    this.usuariosJson = usuarios;
  }

  autentificarse(usuario: string, clave: string) : boolean {
    this.usuarioActual = null;
    for(let i of this.usuariosJson){
        if(i.usuario === usuario && i.clave === clave){
          this.usuarioActual = i;
          localStorage.setItem("usuario", i.id.toString());
        }
    }
    return this.usuarioActual != null;
  }

  estaAutentificado() : boolean{
    this.usuarioActual = null;
    if(localStorage.getItem("usuario") != null){
      this.usuarioActual = this.buscarUsuario(localStorage.getItem("usuario"));
    }
    return this.usuarioActual != null;
  }

  getRol() : string{
    let salida: string = "normal";
    if(this.estaAutentificado()){
      if(this.esAdmin()){
        salida = "admin";
      }
      else if(this.esEditor()){
        salida = "editor";
      }
    }
    else{
      salida = "nulo";    
    }    
    return salida;
  }

  esAdmin():boolean {
    return this.estaAutentificado() && this.usuarioActual.admin === "S";
  }

  esEditor():boolean {
    return this.estaAutentificado() && this.usuarioActual.lugaresAsignados != null && this.usuarioActual.lugaresAsignados.length > 0;
  }

  buscarUsuario(id : string):usuario{
    let usuario: usuario = null;
    if(id != null && this.usuariosJson != null && this.usuariosJson.length > 0){
      for(let i of this.usuariosJson){
        if(i.id.toString() === id){
            usuario = i;
          }
      }
    }
    return usuario;
  }
}
