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
  imagenesNuevas: string[];
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
                                    Validators.required,
                                    Validators.pattern("^https?\:\/\/www\.youtube\.com\/embed\/.+$")
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
      horario: "",
      latitud: 0,
      longitud: 0
    }
    this.imagenes = []
    this.imagenesNuevas = []
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
  }

  guardar() {
    this.validar();
    if(!this.formulario.valid){
      Swal.fire({
        type: 'error',
        title: 'Debe completar todos los campos requeridos'
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
      this.datosService.actualizarElemento("lugares", this.lugar).then(()=>{
        Swal.fire({
          type: 'success',
          title: 'Guardado correctamente'
        });
        this.cerrarModal();
        setTimeout(()=>{
          this.router.navigate(["/lugares"]);
        }, 1000);
      }).catch(err =>{
        Swal.fire({
          type: 'error',
          title: 'Error al guardar el lugar',
          text: err.message
        });
      });
    }
    else{
      Swal.fire({
        type: 'error',
        title: 'No se ha cargado el lugar'
      });
    }
  }

  eliminarImagen(indice : number){
    Swal.fire({
      title: 'Estás seguro de eliminarlo?',
      text: "No podrás revertir esto si guardas así!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        if(indice != -1){
          var esNueva = true;
          var elemento = (<string[]> this.imagenes).splice(indice, 1);
          var img = []
          for(let i in this.lugar.imagenes){
            if(this.lugar.imagenes[i] != elemento[0]){
              img.push(this.lugar.imagenes[i]);
            }
            else{
                esNueva = false;
            }
          }
          this.lugar.imagenes = img;
          if(esNueva){
            var img = []
            for(let i in this.imagenesNuevas){
              if(this.imagenesNuevas[i] != elemento[0]){
                img.push(this.lugar.imagenes[i]);
              }
            }
          }
          this.indiceImgSeleccionada = indice - 1;
          if(this.indiceImgSeleccionada < 0 ){
            this.indiceImgSeleccionada = 0;
          }
        }
      }
    })
    
  }

  cargarImagenes(){
    this.imagenes = []
    if(this.lugar && this.lugar.imagenes){
      for(let x in this.lugar.imagenes){
        this.imagenes.push(this.lugar.imagenes[x])
        
      }     
    }
    if(this.imagen && this.imagen.imagenesSubidas){
      for(let x in this.imagen.imagenesSubidas){
        this.imagenesNuevas.push(this.imagen.imagenesSubidas[x])
      }
    }
    for(let i in this.imagenesNuevas){
      this.imagenes.push(this.imagenesNuevas[i])      
    }        
  }

  cargarImagen(e) {
    if(e.target.files.length != 0) {
      this.imagen.cargarImagen(e.target.files);      
      var intervalo = setInterval(x => {
        if(this.imagen.cambios){
          this.cargarImagenes()
          this.imagen.cambios = false;
          clearInterval(intervalo)
        }
      }, 500)
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

  cerrarModal() {
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
