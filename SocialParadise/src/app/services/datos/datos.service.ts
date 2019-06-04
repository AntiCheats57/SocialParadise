import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  constructor(private firestore : AngularFirestore) {
  }

  insertarElemento(coleccion : string, elemento : any, generarId : boolean) {
    if(generarId){
      elemento.idFB = this.firestore.createId();      
    }
    return this.firestore.collection(coleccion).doc(elemento.idFB).set(elemento);
  }

  actualizarElemento(coleccion : string, elemento : any) {
    return this.firestore.collection(coleccion).doc(elemento.idFB).update(elemento);
  }

  obtenerElementoId(coleccion : string, elementoId : string) {
    return this.firestore.collection(coleccion, ref => ref.where('id','==', parseInt(elementoId))).valueChanges();
  }
  
  obtenerElementoIdFB(coleccion : string, elementoIdFB : string) {
    return this.firestore.collection(coleccion).doc(elementoIdFB).valueChanges();
  } 

  obtenerColeccion(coleccion : string) {
    return this.firestore.collection(coleccion).valueChanges() as Observable<any>;
  }
  
  obtenerUltimoId(coleccion : string){
    return this.firestore.collection(coleccion, ref => ref.orderBy("id", "desc").limit(1)).get().toPromise();
  }

  obtenerColeccionCondicion(coleccion : string, campoCondicion : string,valorCondicion: any) {
    return this.firestore.collection(coleccion, ref => ref.where(campoCondicion, '==', valorCondicion)).valueChanges() as Observable<any>;
  }

  eliminarElemento(coleccion : string, elementoIdFB : string) {
    return this.firestore.collection(coleccion).doc(elementoIdFB).delete();
  }
}
