import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lugar } from 'src/app/interfaces/lugar.interface';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  private suscripcion : Subscription;
  private rutaRaiz : string;

  constructor(private firestore : AngularFirestore, private httpCliente : HttpClient) {
    this.rutaRaiz = environment.firebase.databaseURL + "/";
  }

  insertarElemento(coleccion : string, elemento : any) {
    var idFB = this.firestore.createId();
    elemento.idFB = idFB;
    return this.firestore.collection(coleccion).doc(elemento.idFB).update(elemento);
  }

  actualizarElemento(coleccion : string, elemento : any) {
    return this.firestore.collection(coleccion).doc(elemento.idFB).update(elemento);
  }

  obtenerElementoId(coleccion : string, elementoId : string) {
    return this.firestore.collection(coleccion, ref => ref.where('id','==', parseInt(elementoId))).valueChanges();
  }

  /*obtenerElementoIdFB(coleccion : string, elementoIdFB : string) {
    return this.firestore.collection(coleccion).doc(elementoIdFB).snapshotChanges();
  }*/ 

  obtenerColeccion(coleccion : string) {
    return this.firestore.collection(coleccion).valueChanges() as Observable<any>;
  }

  eliminarElemento(coleccion : string, elementoIdFB : string) {
    return this.firestore.collection(coleccion).doc(elementoIdFB).delete();
  }
}
