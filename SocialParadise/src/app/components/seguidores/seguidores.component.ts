import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatosService } from 'src/app/services/datos/datos.service';
import { Subscription } from 'rxjs';
import { lugar } from 'src/app/interfaces/lugar.interface';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-seguidores',
  templateUrl: './seguidores.component.html',
  styleUrls: ['./seguidores.component.css']
})
export class SeguidoresComponent implements OnInit {

  lugarId  : string;
  seguidores: any[];
  suscLugar: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private datosService : DatosService) { }

  ngOnInit() {
    this.lugarId = this.route.snapshot.params['id'];
    if(this.lugarId){
      this.suscLugar = this.datosService.obtenerElementoId("lugares", this.lugarId).subscribe(datos => {
        if(datos){
          var seguidoresTemp = (<lugar> datos[0]).seguidores
          this.seguidores = []
          var suscripcion;
          for(let i in seguidoresTemp){
            suscripcion = this.datosService.obtenerElementoId("usuario", seguidoresTemp[i].toString()).subscribe(usuario => {
              if(usuario){
                this.seguidores.push({
                  foto : usuario[0]["foto"],
                  nombre : usuario[0]["nombre"] + " " + usuario[0]["apellidos"]
                })
              }
              suscripcion.unsuscribe()
            })
          }  
        }
        else{
          Swal.fire({
            type: 'error',
            title: 'Error al cargar los seguidores',
            text: 'No se encontraron datos'
          });
        }
      });    
    }    
    else{
      Swal.fire({
        type: 'error',
        title: 'Error al obtener el lugar',
        text: 'No se proporcionó el identificador del lugar'
      });
    }
    $(document).ready(function() {
      $("#seguidoresModal").modal("show");
    });    
  }

}
