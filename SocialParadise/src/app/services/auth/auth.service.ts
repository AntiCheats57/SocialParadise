import { Injectable } from '@angular/core';

import {AngularFireDatabase, AngularFireObject, AngularFireList} from 'angularfire2/database'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { map } from 'rxjs/operators';
import { usuario } from 'src/app/interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
 
  private usuarioActual: usuario;  
  private usuarios: AngularFireList<any>;

  constructor(/*private fireAuth: AngularFireAuth, private firestore: AngularFirestore, private usuariosService: UsuariosService*/) { 
    
  }
  
  loginFacebook() {
    /*return this.fireAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
      .then(credential => this.usuariosService.actualizarUsuario(credential.user))*/
  }

  loginGoogle() {
    /*return this.fireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(credential => this.usuariosService.actualizarUsuario(credential.user))*/
  }
/*
  logout() {
    return this.fireAuth.auth.signOut();
  }

  registrarUsuarioCorreoClave(correo: string, clave: string) {
    return new Promise((resolve, reject) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(correo, clave)
        .then(userData => {
          resolve(userData),
            this.usuariosService.actualizarUsuario(userData.user)
        }).catch(err => console.log(reject(err)))
    });
  }

  loginCorreoClave(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.fireAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData),
        err => reject(err));
    });
  }
*/
  estaAutentificado() {
    //return this.fireAuth.authState.pipe(map(auth => auth));
    return true;
  }

  esAdmin(userUid) {
   // return this.firestore.doc<usuario>(`usuarios/${userUid}`).valueChanges();
   return true;
  }

  esEditor() {
    return true;
  }
/*







  autentificarse(usuario: string, clave: string) : boolean {
    this.usuarios = this.firebase.list('usuarios');
    for(i in this.usuarios){

    }
    
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
  } */
}
