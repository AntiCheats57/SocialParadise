import { Component, OnInit } from '@angular/core';
import { usuario } from 'src/app/interfaces/usuario.interface';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})

export class RegistrarseComponent implements OnInit {
  formulario: FormGroup;
  usuario: usuario;

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
                                    Validators.minLength(6)
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
    this.usuario = new usuario();
    this.formulario.setValue({nombre: "Dana", apellidos: "Vargas", usuario: "dvargas", clave: "1234567", email: "404danavargas@gmail.com" });
  }

  registrarEmail(): void {
    this.usuario.nombre = this.formulario.controls['nombre'].value;
    this.usuario.apellidos = this.formulario.controls['apellidos'].value;
    this.usuario.usuario = this.formulario.controls['usuario'].value;
    this.usuario.clave = this.formulario.controls['clave'].value;
    this.usuario.correo = this.formulario.controls['email'].value;
    
    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
    this.auth.registrarUsuario(this.usuario).then((res) => {
      Swal.close();
      this.router.navigateByUrl('');
    }).catch ( err => {
      Swal.fire({
          type: 'error',
          title: 'Error al registrarse',
          text: err.message
        });
    });
  }

  registrarGoogle() {
    this.auth.loginGoogle().then((res) => {
      this.router.navigateByUrl('');
    }).catch ( err => console.log(err));
  }

  registrarFacebook() {
    this.auth.loginFacebook().then((res) => {
      this.router.navigateByUrl('');      
    }).catch ( err => console.log(err));
  }

}
