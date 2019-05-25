import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){
  }

  canActivate() {
    if (this.authService.estaAutentificado()) {
      return true;
    }
    else {
      this.router.navigate(['loguearse']);
      return false;
    }
  }

}
