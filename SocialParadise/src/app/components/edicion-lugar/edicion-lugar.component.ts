import { Component, OnInit } from '@angular/core';
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

export class EdicionLugarComponent implements OnInit {
  formulario: FormGroup;
  lugarId: number;
  lugar: lugar;

  private suscripcionLugar : Subscription;

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
    this.lugarId = this.route.snapshot.params['id'];
    this.suscripcionLugar = this.datosService.obtenerElementoId("lugares", this.lugarId.toString()).subscribe(datos => {
      if(datos){
        this.lugar = (<lugar> datos[0])        
        for(let x in this.imagen.imagenes){
          this.lugar.imagenes.push(this.imagen.imagenes[x])
        }
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
  }

  guardar() {
    if(this.lugar != null){
      this.lugar.nombre = this.formulario.get("nombre").value
      this.lugar.video = this.formulario.get("video").value
      this.lugar.descripcion = this.formulario.get("descripcion").value
      for(let x in this.imagen.imagenes){
        (<string[]> this.lugar.imagenes).push(this.imagen.imagenes[x])
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

  cargarImagen(e) {
    if(e.target.files.length != 0) {
      this.imagen.cargarImagen(e.target.files);      
    }
  }

  ngOnDestroy(): void {
    this.suscripcionLugar.unsubscribe();
  }

}
