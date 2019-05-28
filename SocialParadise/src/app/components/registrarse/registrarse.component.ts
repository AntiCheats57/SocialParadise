import { Component, OnInit } from '@angular/core';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})

export class RegistrarseComponent implements OnInit {
  formulario: FormGroup;

  constructor(private localDataService: LocalDataService, private router: Router, private auth: AuthService) {

    this.formulario = new FormGroup({
      'nombre': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'apellidos': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(5)
                                  ]),
      'usuario': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'clave': new FormControl('', [
                                    Validators.required,
                                    Validators.minLength(4)
                                  ]),
      'email': new FormControl('', [
                                    Validators.required,
                                    Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")
                                  ])
    });
  }

  ngOnInit() {
  }

  registrarse(): void {
    this.localDataService.cargarDatos();
    let user: usuario;
    user.id = null;
    user.nombre = this.formulario.controls['nombre'].value;
    user.apellidos = this.formulario.controls['apellidos'].value;
    user.correo = this.formulario.controls['correo'].value;
    user.clave = this.formulario.controls['clave'].value;
    user.correo = this.formulario.controls['email'].value;
    user.resenas = [];
    user.lugaresSeguidos = [];
    user.lugaresAsignados = [];
    user.admin = false;
    user.foto = "";
    let cont = (<usuario[]> this.localDataService.getUsuarios()).length, cont2 = 0;
    this.localDataService.addUsuario(user);
    cont2 = (<usuario[]> this.localDataService.getUsuarios()).length;
    /*if(cont < cont2){
      if(this.auth.autentificarse(this.formulario.controls['usuario'].value, this.formulario.controls['clave'].value)){        
        this.router.navigate([""])
      }
    } */
   }

}
