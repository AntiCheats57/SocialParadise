import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { map } from 'rxjs/operators';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient, public afAuth: AngularFireAuth) { 
  }
 
  registrarUsuario(usuario: usuario) {
    return new Promise ((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(usuario.correo, usuario.clave)
      .then( userData => resolve(userData), err => reject(err));
    })
  }

  loginEmail(correo: string, clave: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(correo, clave)
      .then(userData => resolve(userData), err => reject(err));
    })
  }

  loginGoogle() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginFacebook() {
    return this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
  }
  
  logout() {
    this.afAuth.authState.subscribe( user => {
         console.log(user);
         if (!user) {
           return;
        }
    });
    this.afAuth.auth.signOut()
    this.afAuth.authState.subscribe( user => {
         console.log(user);
         if (!user) {
           return;
        }
    });
    return true;
  }

  estaAutentificado() {    
    return this.afAuth.authState.pipe(map(auth => auth));
  }
  
  esAdmin(): boolean {
    return true;
  }

  esEditor(): boolean {
    return true;
  }

    // this.afAuth.authState.subscribe( user => {
    //   console.log('Estado del usaurio: ', user);
    //   if (!user) {
    //     return;
    //   }
    //   this.usuario.nombre = user.displayName;
    //   this.usuario.uid = user.uid;
    // })
}
