import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Observable, of, Subscription } from 'rxjs';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { DatosService } from 'src/app/services/datos/datos.service';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private localStorage: LocalDataService, private datosService: DatosService){
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.estaAutentificado()){
      if('admin' === next.data.role){
        if(this.authService.esAdmin()){
          return true;
        }
      }
      else if('editor' === next.data.role){      
        if(this.authService.esEditor()){
          return true;
        }
      }
    }    
    this.router.navigate(['**']);
    return false;
  }

}
