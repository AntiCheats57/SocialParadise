import { Component, OnInit, OnDestroy } from '@angular/core';
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
      'video': new FormControl('', [
                                    Validators.required,
                                    Validators.pattern("^http:\/\/(.*\.(com$|net$|org$))")
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
      usuario: 0,
      video: ""
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
            video: this.lugar.video
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
        this.router.navigate(["/lugares"])
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
    if(indice != -1){
      (<string[]> this.imagenes).splice(indice, 1);
      this.indiceImgSeleccionada = indice - 1;
      if(this.indiceImgSeleccionada < 0 ){
        this.indiceImgSeleccionada = 0;
      }
    }
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
}
