import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { map } from 'rxjs/operators';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { HttpClient } from '@angular/common/http';
import { DatosService } from '../datos/datos.service';
import { LocalDataService } from '../local-data/local-data.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  autentificado : boolean;
  estadoAutentificado : Subscription;
  adminSuscripcion: Subscription;
  editorSuscripcion: Subscription;

  constructor(private http: HttpClient, public afAuth: AngularFireAuth, private datosService : DatosService, private localStorage : LocalDataService) { 
    this.verificarEstadoAutentificado();
  }
 
  registrarUsuario(usuario: usuario) {
    return new Promise ((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(usuario.correo, usuario.clave)
      .then( userData => resolve(userData), err => reject(err));
    })
  }

  loginEmail(correo: string, clave: string) {
    if(!this.estadoAutentificado){
      this.verificarEstadoAutentificado()
    }
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(correo, clave)
      .then(userData => resolve(userData), err => reject(err));
    })
  }

  loginGoogle() {
    if(!this.estadoAutentificado){
      this.verificarEstadoAutentificado()
    }
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginFacebook() {
    if(!this.estadoAutentificado){
      this.verificarEstadoAutentificado()
    }
    return this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
  }
  
  logout() {
    this.afAuth.authState.subscribe( user => {
         if (!user) {
           this.autentificado = false;
           return;
        }
    });
    this.afAuth.auth.signOut()
    this.afAuth.authState.subscribe( user => {
         if (!user) {
          this.autentificado = false;
           return;
        }
    });
    this.localStorage.agregarUsuarioActual( {
      id : 0,
      idFB: "",
      foto : "",
      nombre : "",
      correo : "",
      usuario : ""
    });
    return true;
  }

  estaAutentificado() {    
    return this.autentificado;
  }
  
  esAdmin() {
    var usuario = this.localStorage.obtenerUsuarioActual();
    return this.datosService.obtenerElementoId("usuarios", usuario["id"]).toPromise();
  }

  esEditor() {
    var usuario = this.localStorage.obtenerUsuarioActual();
    return this.datosService.obtenerColeccionCondicion("lugares", "usuario", usuario["id"]).toPromise();
  }

  almacenarUsuarioLocalStorage(idFB : string){
    this.datosService.obtenerElementoIdFB("usuarios", idFB).subscribe(datos => {
        if(datos){
          setInterval(() => {this.localStorage.agregarUsuarioActual({
            id : datos["id"],
            idFB :  datos["idFB"],
            correo : datos["correo"],
            foto:  datos["foto"],
            nombre: datos["nombre"] + (datos["apellidos"]? " " + datos["apellidos"] : ""),
            usuario: datos["usuario"]
          })
        }, 5000);
      }
    })
  }

  verificarEstadoAutentificado(){
    this.estadoAutentificado = this.afAuth.authState.subscribe(res => {      
      if(res){
        this.autentificado = true;
      }
      else{
        this.autentificado = false;
      }
      console.info(this.autentificado)
    });
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
