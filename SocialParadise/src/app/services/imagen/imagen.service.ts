import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class ImagenService {
  public imagenes;
  public imagenesSubidas;
  public cambios: boolean;

  constructor(private storage: AngularFireStorage) {
    this.cambios = false;
    this.imagenesSubidas = []
  }

  cargarImagen(archivos: FileList) {

    this.imagenes = new Array(archivos.length);
    
    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    for (let i = 0; i < archivos.length; i++) {
      const id = Math.random().toString(36).substring(2);
      const file = archivos[i];
      const filePath = `uploads/${id}${'-'}${file.name}`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      
      task.snapshotChanges().pipe( finalize(() => {
        ref.getDownloadURL().toPromise().then( (url) => {
          this.imagenes[i] = url;
          console.log(url);
          if(i == archivos.length-1) {
            Swal.fire({
              type: 'success',
              title: 'Operación exitosa',
              showConfirmButton: false,
              timer: 1500
            })
          }
          this.imagenesSubidas.push(this.imagenes[i])
          this.cambios = true;
        })
      })).subscribe();
    }
  }

}
