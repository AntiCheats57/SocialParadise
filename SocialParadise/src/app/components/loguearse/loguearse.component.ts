import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loguearse',
  templateUrl: './loguearse.component.html',
  styleUrls: ['./loguearse.component.css']
})

export class LoguearseComponent implements OnInit {
  private usuario: string;
  private clave: string;
  private error: string;

  constructor(private auth: AuthService, private router: Router) {
    this.usuario = "";
    this.clave = "";
    this.error = "";
  }

  ngOnInit() { }

  loguearse(): boolean {
    if (this.usuario != "" && this.clave != "") {
      if (this.auth.autentificarse(this.usuario, this.clave)) {
        this.router.navigate([""]);
      } else {
        this.error = "Usuario y/o contraseña incorrectos";
      }
    } else {
      this.error = "Complete todos los campos";
    }
    return this.auth.estaAutentificado();
  }

}
