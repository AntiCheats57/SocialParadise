import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ImagenService } from 'src/app/services/imagen/imagen.service';
import { lugar } from 'src/app/interfaces/lugar.interface';
import { Subscription, ObjectUnsubscribedError, Observable } from 'rxjs';
import { DatosService } from 'src/app/services/datos/datos.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-edicion-lugar',
  templateUrl: './edicion-lugar.component.html',
  styleUrls: ['./edicion-lugar.component.css']
})

export class EdicionLugarComponent implements OnInit, OnDestroy {
  formulario: FormGroup;
  lugarId: number;
  lugar: lugar;
  indiceImgSeleccionada: number;
  imagenes: string[];
  private suscripcionLugar : Subscription;
  private suscripcionImagenes : Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private imagen: ImagenService, private datosService : DatosService) {
    this.formulario = new FormGroup({
      'nombre': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'descripcion': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(15)
                                  ]),
      'horario': new FormControl('', [
                                    Validators.required
                                  ]),
      'video': new FormControl('', [
                                    Validators.required
                                    //Validators.pattern("^http:\/\/(.*\.(com$|net$|org$))")
                                    // Validators.pattern("https://www.youtube.com/embed/.$")
                                  ])
    });    
  }

  ngOnInit() {
    this.lugar = {
      id: -1,
      idFB: "",
      descripcion: "",
      imagenes: [],
      ubicacion: "",
      nombre: "",
      seguidores: [],
      usuario: -1,
      video: "",
      horario: ""
    }
    this.imagenes = []
    this.lugarId = this.route.snapshot.params['id'];
    this.suscripcionLugar = this.datosService.obtenerElementoId("lugares", this.lugarId.toString()).subscribe(datos => {
      if(datos){
        this.lugar = (<lugar> datos[0])       
        this.cargarImagenes(); 
        this.formulario.setValue({
            nombre: this.lugar.nombre,
            descripcion: this.lugar.descripcion,
            video: this.lugar.video,
            horario: this.lugar.horario
            }
          )
      }
      else{
        Swal.fire({
          type: 'error',
          title: 'Error al cargar el lugar',
          text: 'No se encontraron datos'
        });
      }
    });
    $(document).ready(function() {
      $("#lugarModal").modal("show");
    });
    setInterval(x => {
    this.cargarImagenes()
    }, 1500)
  }

  guardar() {
    if(!this.formulario.valid){
      Swal.fire({
        type: 'error',
        title: 'Error al guardar los cambios al perfil',
        text: 'Debe completar correctamente todos los campos'
      });
      return;
    }
    if(this.lugar != null){
      this.lugar.nombre = this.formulario.get("nombre").value
      this.lugar.video = this.formulario.get("video").value
      this.lugar.descripcion = this.formulario.get("descripcion").value
      this.lugar.horario = this.formulario.get("horario").value
      this.lugar.imagenes = []
      for(let x in this.imagenes){
        (<string[]> this.lugar.imagenes).push(this.imagenes[x])
      }
      this.datosService.actualizarElemento("lugares", this.lugar).catch(err =>{
        Swal.fire({
          type: 'error',
          title: 'Error al guardar el lugar',
          text: err.message
        });
      }).then(()=>{
        Swal.fire({
          type: 'success',
          title: 'Guardado correctamente'
        });
        this.router.navigate(["/lugares"]);
      });
    }
    else{
      Swal.fire({
        type: 'error',
        title: 'No se ha cargado el lugar'
      });
    }
    this.cerrarComponente();
  }

  eliminarImagen(indice : number){
    Swal.fire({
      title: 'Estás seguro de eliminarlo?',
      text: "No podrás revertir esto!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        if(indice != -1){
          (<string[]> this.imagenes).splice(indice, 1);
          this.indiceImgSeleccionada = indice - 1;
          if(this.indiceImgSeleccionada < 0 ){
            this.indiceImgSeleccionada = 0;
          }
        }
      }
    })
    
  }

  cargarImagenes(){
    if(this.lugar && this.lugar.imagenes){
      for(let x in this.lugar.imagenes){
        this.imagenes.push(this.lugar.imagenes[x])
      }
      this.lugar.imagenes = []
    }
    if(this.imagen && this.imagen.imagenesSubidas){
      for(let x in this.imagen.imagenesSubidas){
        this.imagenes.push(this.imagen.imagenesSubidas[x])
      }
      this.imagen.imagenesSubidas = []
    }
  }

  cargarImagen(e) {
    if(e.target.files.length != 0) {
      this.imagen.cargarImagen(e.target.files);      
    }
  }

  cambiarIndiceImg(operacion: string){
    if(operacion === "aumentar" && this.indiceImgSeleccionada < (this.lugar.imagenes.length - 1)){
      this.indiceImgSeleccionada++;
    }
    else if(operacion === "disminuir" && this.indiceImgSeleccionada > 0){
      this.indiceImgSeleccionada--;
    };
  }

  ngOnDestroy(): void {
    if(this.suscripcionLugar){
      this.suscripcionLugar.unsubscribe();
    }
    if(this.suscripcionImagenes){
      this.suscripcionImagenes.unsubscribe();
    }
    if(this.imagen && this.imagen.imagenesSubidas){
      this.imagen.imagenesSubidas = [];
    }
  }

  cerrarVisor() {
    $(document).ready(function() {
      $("#image-gallery").modal("hide");
    });
  }

  cerrarComponente() {
    $(document).ready(function() {
      $("#lugarModal").modal("hide");
    });
  }

  validar() {
    this.markFormGroupTouched(this.formulario);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
