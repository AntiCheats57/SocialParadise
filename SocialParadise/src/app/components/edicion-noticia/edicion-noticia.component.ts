import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ImagenService } from 'src/app/services/imagen/imagen.service';
import { noticia } from 'src/app/interfaces/noticia.interface';
import { Subscription } from 'rxjs';
import { DatosService } from 'src/app/services/datos/datos.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-edicion-noticia',
  templateUrl: './edicion-noticia.component.html',
  styleUrls: ['./edicion-noticia.component.css']
})

export class EdicionNoticiaComponent implements OnInit, OnDestroy {
  formulario: FormGroup;
  noticiaId: string;
  encabezadoModal: string;
  noticia: noticia;
  suscripcionNoticiaCargar: Subscription;
  suscripcionNoticiaGuardar: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private imagen: ImagenService, private datosService: DatosService) {
    this.formulario = new FormGroup({
      'titulo': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(8)
                                  ]),
      'contenido': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(10),
                                    Validators.maxLength(250)
                                  ])
    });
  }

  ngOnInit() {
    this.noticia = {
      id: -1,
      idFB: "",
      contenido: "",
      fechaCreacion: "",
      imagen: "",
      titulo: ""
    }
    this.noticiaId = this.route.snapshot.params['id'];
    if (this.noticiaId) {
      this.encabezadoModal = "Editar noticia";
    }
    else {
      this.encabezadoModal = "Agregar noticia";
    }
    if(this.noticiaId){
      this.suscripcionNoticiaCargar = this.datosService.obtenerElementoId("noticias", this.noticiaId.toString()).subscribe(datos => {
        if(datos){
          this.noticia = (<noticia> datos[0])       
          this.formulario.setValue({
              titulo: this.noticia.titulo,
              contenido: this.noticia.contenido
            }
          )
        }
        else{
          Swal.fire({
            type: 'error',
            title: 'Error al cargar la noticia',
            text: 'No se encontraron datos'
          });
        }
      });    
    }    
    else{
      this.noticia.titulo = "";
      this.noticia.contenido = "";
      this.noticia.imagen = "";
    }
    $(document).ready(function() {
      $("#noticiaModal").modal("show");
    });    
  }

  guardar() {
    this.validar();
    if(!this.formulario.valid || !this.noticia.imagen){
      Swal.fire({
        type: 'error',
        title: 'Debe completar todos los campos correctamente',
        text: this.noticia.imagen? '': 'Debe subir una imagen para la noticia'
      });
      return;
    }
    if(this.noticia != null){
      this.noticia.titulo = this.formulario.get("titulo").value
      this.noticia.contenido = this.formulario.get("contenido").value
      if(!this.noticia.idFB){
        this.noticia.fechaCreacion = formatDate(Date.now(), "MM/dd/yyyy hh:mm a", "en-US");
      }
      if(this.noticia.idFB && this.noticia.id >= 0){
        this.datosService.actualizarElemento("noticias", this.noticia).catch(err =>{
          Swal.fire({
            type: 'error',
            title: 'Error al guardar la noticia',
            text: err.message
          });
        }).then(()=>{
          Swal.fire({
            type: 'success',
            title: 'Guardado correctamente'
          });
          this.cerrarModal();
          setTimeout(()=>{
            this.router.navigate(["/noticias"]);
          }, 1000);
        });
      }
      else{
         this.datosService.obtenerUltimoId("noticias").then(datos => {
          if(datos != undefined && datos.docs[0] != undefined){
            this.noticia.id = (<noticia> datos.docs[0].data()).id + 1
          }
          else{
            this.noticia.id = 0
          }          
          this.datosService.insertarElemento("noticias", this.noticia, true).catch(error => {
            Swal.fire({
              type: 'error',
              title: 'Error al guardar',
              timer: 1500
            })      
          }).then(() => {      
            Swal.fire({
              type: 'success',
              title: 'Guardado correctamente',
              timer: 1500
            })
            this.cerrarModal();
            setTimeout(()=>{
              this.router.navigate(["/noticias"]);
            }, 1000);
          })
        }) 
      }
    }
  }

  eliminar(){
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
        this.cerrarModal();
        Swal.fire(
          'Eliminado!',
          'El registro ha sido eliminado.',
          'success'
        )
        setTimeout(()=>{
          this.router.navigate(["/noticias"]);
          if(this.noticiaId && this.noticia){
            this.datosService.eliminarElemento("noticias", this.noticia.idFB);
          }
        }, 200);
      }
    })
  }

  cargarImagen(e) {
    if(e.target.files.length != 0) {
      this.imagen.cargarImagen(e.target.files);
    
      var intervalo = setInterval(x =>{
        if(this.imagen.cambios){
          for(let x in this.imagen.imagenesSubidas){
            this.noticia.imagen = this.imagen.imagenesSubidas[x];
          }
          this.imagen.cambios = false
          clearInterval(intervalo)
        }
      }, 1000)
    }
  }

  ngOnDestroy(): void{
    if(this.suscripcionNoticiaCargar){
      this.suscripcionNoticiaCargar.unsubscribe();  
    }
    if(this.suscripcionNoticiaGuardar){
      this.suscripcionNoticiaGuardar.unsubscribe();  
    }
    if(this.imagen && this.imagen.imagenesSubidas){
      this.imagen.imagenesSubidas = [];
    }
  }

  cerrarModal() {
    $(document).ready(function() {
      $("#noticiaModal").modal("hide");
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
