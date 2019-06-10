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
    return this.admin;
  }

  esEditor(){
    return this.editor;
  }

  estaAutentificado() {  
    var usuarioActual = this.localStorage.obtenerUsuarioActual();
    if(this.autentificado == undefined){
      if(usuarioActual["id"] >= 0 && usuarioActual["idFB"] != ""){
        this.autentificado = true;
      }
    }
    return this.autentificado;
  }

  almacenarUsuarioLocalStorage(idFB : string){
    this.datosService.obtenerElementoIdFB("usuarios", idFB).subscribe(datos => {
      console.info("")
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
      }      
    });
  }

  cargarDatosUsuarioLocalStorage(){
    var usuario = this.localStorage.obtenerUsuarioActual()
    if(usuario != null && usuario != undefined && usuario.idFB){
      this.almacenarUsuarioLocalStorage(usuario.idFB)
    }
  }
}
