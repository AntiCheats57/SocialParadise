import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { usuario } from 'src/app/interfaces/usuario.interface';
import Swal from 'sweetalert2';

//Imagen
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-loguearse',
  templateUrl: './loguearse.component.html',
  styleUrls: ['./loguearse.component.css']
})

export class LoguearseComponent implements OnInit {
  usuario: usuario = new usuario();
  //imagen
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  @ViewChild('imageUser') inputImageUser: ElementRef;
  // 

  constructor(private auth: AuthService, private router:Router, private storage: AngularFireStorage) { 
  }

  ngOnInit() { }

  loginGoogle() {
    this.auth.loginGoogle().then((res) => {
      this.router.navigateByUrl('');
    }).catch ( err => console.log(err));
  }

  loginFacebook() {
    this.auth.loginFacebook().then((res) => {
      this.router.navigateByUrl('');
    }).catch ( err => console.log(err));
  }

  loginEmail() {
    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
    this.auth.loginEmail(this.usuario).then((res) => {
      Swal.close();
      this.router.navigateByUrl('');
    }).catch ( err => {
      Swal.fire({
        type: 'error',
        title: 'Error al autenticar',
        text: err.message
      });
    });
  }
  
  //IMAGEN
  // imgs: files[]

  // imgs.nombre
  // imgs.url
  // .progreso
  // .

  // for (const i of imgs) {
  //  i.url =  

  //  () objeto jsonpCallbackContext
  //  Noticias.
  // }

   onUpload(e) {
    //console.log('subir', e.target.files[0]);
    //new Promise ((resolve, reject) => {
      for (let i = 0; i < e.target.files.length; i++) {
        const id = Math.random().toString(36).substring(2);
        const file = e.target.files[i];
        const filePath = `uploads/${e.target.files[i].name}${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
      
        this.uploadPercent = task.percentageChanges();
        // task.snapshotChanges().pipe( finalize(() => {
        //   this.urlImage = ref.getDownloadURL();

        //   let data: any={
        //     "name": "nombre",
        //     "url": "url"
        //   }
        //   Image.url = ref.getDownloadURL()
        //   Image.nombre = 

        //   noticia.img= data;
        //   this.firebase.putNoticia(noticia, nodo).subscribe(res=>{});

        // })).subscribe();
      task.snapshotChanges().pipe( finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
      }
    //})
   }
  
   usuarioActual() {
     this.auth.estaAutentificado().subscribe(auth => {
       if(auth) {
         console.log('Logueado');         
       } else {
         console.log('No Logueado');
       }
     })
   }

   cargarImagen() {
    //  this.auth.estaAutentificado().subscribe( user => {
    //    if(user) {
    //      console.log(user);

    //      user.updateProfile({
    //       displayName: 'Jose',
    //       photoURL: this.inputImageUser.nativeElement.value
    //      }).then( function () {
    //        console.log('user update');
    //      }).catch(function (error) {
    //        console.log('error: '+ error);
    //      });

    //      this.usuario.foto = user.photoURL;
    //    }
    //  })
    console.log(this.uploadPercent.pipe);
   }
}
