import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuario/usuario.service';
import { DecimalPipe } from '@angular/common';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { Observable, Subscription } from 'rxjs';
import { lugar } from 'src/app/interfaces/lugar.interface';
import Swal from 'sweetalert2';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DatosService } from 'src/app/services/datos/datos.service';
declare var $: any;

@Component({
  selector: 'app-asignar-lugar',
  templateUrl: './asignar-lugar.component.html',
  styleUrls: ['./asignar-lugar.component.css'],
  providers: [UsuariosService, DecimalPipe]
})

export class AsignarLugarComponent implements OnInit, OnDestroy {
  usuarios$: Observable<usuario[]>;
  total$: Observable<number>;
  formulario: FormGroup;
  indexLugar: string;
  encabezadoModal: string;
  editor: usuario;
  lugar: lugar;
  suscLugar: Subscription;
  editorAnteriorId: number;

  constructor(private router: Router, private route: ActivatedRoute, public service: UsuariosService, private datosService : DatosService) {
    this.usuarios$ = service.usuarios$;
    this.total$ = service.total$;
    this.formulario = new FormGroup({
      'nombre': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'ubicacion': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'editor': new FormControl('')
    });
  }

  ngOnInit() {
    this.editor = {
      id: -1,
      idFB: "",
      nombre: "",
      apellidos: "",
      usuario: "",
      clave: "",
      correo: "",
      foto: "",
      resenas: [],
      lugaresAsignados: [],
      lugaresSeguidos: [],
      admin: false
    }
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
    this.indexLugar = this.route.snapshot.params['id'];
    if (this.indexLugar) {
      this.encabezadoModal = "Editar lugar";
      this.cargarLugar();
    } 
    else {
      this.encabezadoModal = "Agregar lugar";
    }
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
    if(this.lugar){
      this.lugar.nombre = this.formulario.get("nombre").value
      this.lugar.ubicacion = this.formulario.get("ubicacion").value
      if(this.editor && this.editor.id >= 0 && this.indexLugar){
        var estaAsignado = false;
        for(let i in this.editor.lugaresAsignados){
          if(this.lugar.id == this.editor.lugaresAsignados[i]){
            estaAsignado = true;
          }
        }
        if(!estaAsignado){
          this.editor.lugaresAsignados.push(this.lugar.id)
          console.log(this.editor);
        }
      }
      this.lugar.usuario = this.editor.id
      if(this.indexLugar){
        this.datosService.actualizarElemento("lugares", this.lugar).catch(err => {             
          Swal.fire({
            type: 'error',
            title: 'Error al guardar el lugar',
            text: err.message
          });
        }).then(()=>{
          if(this.editor && this.editor.id >= 0){
            this.datosService.actualizarElemento("usuarios", this.editor).catch(err => {             
              Swal.fire({
                type: 'error',
                title: 'Error al guardar el editor del lugar',
                text: err.message
              });
            }).then(()=>{          
              Swal.fire({
                type: 'success',
                title: 'Lugar guardado correctamente'
              });
              this.cerrarModal();
              setTimeout(()=>{
                this.router.navigate(["/asignacionLugares"]);
              }, 1000);
            })
          }
          else{
            Swal.fire({
              type: 'success',
              title: 'Lugar guardado correctamente'
            });
            this.cerrarModal();
            setTimeout(()=>{
              this.router.navigate(["/asignacionLugares"]);
            }, 1000);
          }
        })
      }
      else{
        this.datosService.obtenerUltimoId("lugares").then(datos => {
          if(datos != undefined && datos.docs[0] != undefined){
            this.lugar.id = (<lugar> datos.docs[0].data()).id + 1
          }
          else{
            this.lugar.id = 0
          } 
          this.datosService.insertarElemento("lugares", this.lugar, true).catch(err => {             
            Swal.fire({
              type: 'error',
              title: 'Error al guardar el lugar',
              text: err.message
            });
          }).then(()=>{
            if(this.editor && this.editor.id >= 0){
              this.editor.lugaresAsignados.push(this.lugar.id)
              this.datosService.actualizarElemento("usuarios", this.editor).catch(err => {             
                Swal.fire({
                  type: 'error',
                  title: 'Error al guardar el editor del lugar',
                  text: err.message
                });
              }).then(()=>{          
                Swal.fire({
                  type: 'success',
                  title: 'Lugar guardado correctamente'
                });
                this.cerrarModal();
                setTimeout(()=>{
                  this.router.navigate(["/asignacionLugares"]);
                }, 1000);
              })
            }
            else{
              Swal.fire({
                type: 'success',
                title: 'Lugar guardado correctamente'
              });
              this.cerrarModal();
              setTimeout(()=>{
                this.router.navigate(["/asignacionLugares"]);
              }, 1000);
            }
          })
        })
      }
      if(this.editorAnteriorId && (this.editor.id < 0 || this.editor.id != this.editorAnteriorId)){
        var suscripcion = this.datosService.obtenerElementoId("usuarios", this.editorAnteriorId.toString()).subscribe(datos => {
          if(datos){
            var lugaresAsignados = []
            for(let i in datos[0]["lugaresAsignados"]){
              if(datos[0]["lugaresAsignados"][i] != this.lugar.id){
                lugaresAsignados.push(datos[0]["lugaresAsignados"][i])
              }
            }
            datos[0]["lugaresAsignados"] = lugaresAsignados;
            this.datosService.actualizarElemento("usuarios", datos[0]);
          }
        });
      }
    }
  }

  obtenerEditor(usuario: usuario) {
    this.editor = usuario;
  }

  cargarLugar(){
    if(this.indexLugar){
      this.suscLugar = this.datosService.obtenerElementoId("lugares", this.indexLugar).subscribe(datos => {
        if(datos){
          this.lugar = <lugar> datos[0]
          this.formulario.setValue({
            nombre: this.lugar.nombre,
            ubicacion: this.lugar.ubicacion,
            editor: ""
          })
          if(this.lugar.usuario >= 0){
            this.editorAnteriorId = this.lugar.usuario          
            var suscripcion = this.datosService.obtenerElementoId("usuarios", this.lugar.usuario.toString()).subscribe(usu => {
              if(usu){
                this.editor = <usuario> usu[0]  
                suscripcion.unsubscribe()
              }
              else{              
                Swal.fire({
                  type: 'error',
                  title: 'Error al cargar los datos del editor'
                });
              }
            });
          }
        }
        else{
          Swal.fire({
            type: 'error',
            title: 'Error al cargar los datos del lugar'
          });
        }
      })
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
        if(this.lugar && this.lugar.id >=0 && this.indexLugar){
          var indexEditor = this.lugar.usuario;
          this.cerrarModal();
          setTimeout(()=>{
            this.router.navigate(["/asignacionLugares"]);
            this.datosService.eliminarElemento("lugares", this.lugar.idFB).catch(err =>{
              Swal.fire({
                type: 'error',
                title: 'Error al eliminar el lugar',
                text: err.message
              });
            }).then(()=>{
              if(indexEditor >= 0){
                this.datosService.obtenerElementoId("usuarios", indexEditor.toString()).subscribe(datos =>{
                  if(datos){
                    var lugaresAsignados = []
                    for(let i in datos[0]["lugaresAsignados"]){
                      if(datos[0]["lugaresAsignados"][i] != this.indexLugar){
                        lugaresAsignados.push(datos[0]["lugaresAsignados"][i])
                      }
                    }
                    datos[0]["lugaresAsignados"] = lugaresAsignados
                    var suscripcion = this.datosService.actualizarElemento("usuarios", datos[0]).catch(err =>{
                      Swal.fire({
                        type: 'error',
                        title: 'Error al eliminar el enlace del lugar con el editor',
                        text: err.message
                      });
                    }).then(()=>{
                      Swal.fire({
                        type: 'success',
                        title: 'Eliminado correctamente'
                      });
                   })
                  }
                })
              }
              else{
                Swal.fire({
                  type: 'success',
                  title: 'Eliminado correctamente'
                });
              }
            })
          }, 200);
        }
      }
    })
  }

  eliminarEditor() {
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
        if(this.editor && this.editor.id >= 0 && this.lugar && this.lugar.id >= 0){
          this.editor = {
            id: -1,
            idFB: "",
            nombre: "",
            apellidos: "",
            usuario: "",
            clave: "",
            correo: "",
            foto: "",
            resenas: [],
            lugaresAsignados: [],
            lugaresSeguidos: [],
            admin: false
          }
        }
      }
    });
  }

  ngOnDestroy(){
    if(this.suscLugar){
      this.suscLugar.unsubscribe()
    }
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
