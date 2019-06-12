import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
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
  admin : boolean;
  editor : boolean;
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
    this.autentificado = false;
    this.afAuth.auth.signOut()
    this.verificarEstadoAutentificado()
    return true;
  }

  esAdmin(){
    if(this.admin == undefined){
      var usuario = this.localStorage.obtenerUsuarioActual()
      this.admin = this.verificarIntegridadSesion("admin", usuario.idFB)
    }
    return this.admin;
  }

  esEditor(){
    if(this.editor == undefined){
      var usuario = this.localStorage.obtenerUsuarioActual()
      this.editor = this.verificarIntegridadSesion("editor", usuario.idFB)
    }
    return this.editor;
  }

  estaAutentificado() {      
    if(this.autentificado == undefined){
      var usuario = this.localStorage.obtenerUsuarioActual()
      this.autentificado = this.verificarIntegridadSesion("autentificado", usuario.idFB)
    }
    return this.autentificado;
  }

  almacenarUsuarioLocalStorage(idFB : string){
    this.datosService.obtenerElementoIdFB("usuarios", idFB).subscribe(datos => {
      if(!datos){
        datos = {
          id: -1,
          idFB: "",
          correo: "",
          foto: "",
          nombre: "",
          usuario: "", 
          admin: false,
          lugaresAsignados: []
        }
      } 
      this.admin = datos["admin"]
      this.editor = datos["lugaresAsignados"].length > 0
      this.localStorage.agregarUsuarioActual({
        id : datos["id"],
        idFB :  datos["idFB"],
        correo : datos["correo"],
        foto:  datos["foto"],
        nombre: datos["nombre"] + (datos["apellidos"]? " " + datos["apellidos"] : ""),
        usuario: datos["usuario"]
      })
      this.localStorage.agregarDatosSesion({
        "t": this.autentificado? "uAht" + datos["idFB"].substring(1, 7)+ "athU" + datos["idFB"].substring(2, 8) : "",
        "a": this.admin? "aniDm" + datos["idFB"].substring(2, 7)+ "danmi" + datos["idFB"].substring(1, 6) : "",
        "e": this.editor? "DteRIo" + datos["idFB"].substring(1, 5)+ "eDroTi" + datos["idFB"].substring(2, 6) : ""
      })
    })
  }

  verificarEstadoAutentificado(){
    this.estadoAutentificado = this.afAuth.authState.subscribe(res => {            
      if(res){
        this.autentificado = true;
        this.cargarDatosUsuarioLocalStorage()
      }
      else{
        this.autentificado = false;
        this.localStorage.eliminarUsuarioActual();
        this.admin = false;
        this.editor = false;
        this.localStorage.eliminarDatosSesion()
      }      
    });
  }

  verificarIntegridadSesion(tipo: string, idFB: string): boolean{
    var sesion = this.localStorage.obtenerDatosSesion();
    if(sesion == null){
      return false;
    }
    switch(tipo){
      case "autentificado":
        return sesion.t == "uAht" + idFB.substring(1, 7)+ "athU" + idFB.substring(2, 8) 
      case "admin":
        return sesion.a == "aniDm" + idFB.substring(2, 7)+ "danmi" + idFB.substring(1, 6)
      case "editor":
        return sesion.e == "DteRIo" + idFB.substring(1, 5)+ "eDroTi" + idFB.substring(2, 6)
    }
    return false;
  }

  cargarDatosUsuarioLocalStorage(){
    var usuario = this.localStorage.obtenerUsuarioActual()
    if(usuario != null && usuario != undefined && usuario.idFB){
      this.almacenarUsuarioLocalStorage(usuario.idFB)
    }
  }
}
