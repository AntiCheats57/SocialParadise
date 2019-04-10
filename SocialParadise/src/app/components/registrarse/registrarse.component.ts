import { Component, OnInit } from '@angular/core';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { LocalDataService } from 'src/app/services/local-data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent implements OnInit {

  nombre:string;
  apellidos:string;
  usuario:string;
  clave:string;
  correo:string;

  constructor(private localDataService:LocalDataService, private router:Router, private auth:AuthService) { 
  }

  ngOnInit() {
  }

  registrarse():void{
    this.localDataService.cargarDatos();
    let user : usuario;
    user = new usuario();
    user.id = null;
    user.nombre = this.nombre;
    user.apellidos = this.apellidos;
    user.usuario = this.usuario;
    user.clave = this.clave;
    user.correo = this.correo;  
    user.resenas = [];
    user.lugaresSeguidos = [];
    user.lugaresAsignados = [];
    user.admin = "N";
    user.foto = "";
    let cont = (<usuario[]> this.localDataService.getUsuarios()).length, cont2 = 0;
    this.localDataService.addUsuario(user);
    cont2 = (<usuario[]> this.localDataService.getUsuarios()).length;
    if(cont < cont2){
      if(this.auth.autentificarse(this.usuario, this.clave)){        
        this.router.navigate(["perfil"])
      }
    } 
  }
}
