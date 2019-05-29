import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.estaAutentificado()){
      
    }
    else{
      return false;
    }   
    if(/*this.authService.esAdmin()*/ 'Admin' === next.data.role){
      return true;
    }
    else {
      this.router.navigate(['**']);
      return false;
    }
  }

}
