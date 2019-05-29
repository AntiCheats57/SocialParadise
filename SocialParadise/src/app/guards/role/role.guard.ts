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

  editorSuscripcion : Subscription;

  constructor(private authService: AuthService, private router: Router, private localStorage: LocalDataService, private datosService: DatosService){
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.estaAutentificado()){
      if('admin' === next.data.role){
        this.authService.esAdmin().then((res)=>{
          if(res[0] && (<boolean>res[0]["admin"])){
            return true;
          }
          else{
            return false;
          }
        });
      }
      else if('editor' === next.data.role){      
        this.authService.esEditor().then((res)=>{
          if(res[0]){
            return true;
          }
          else{
            return false;
          }
        });
      }
      else{
        this.router.navigate(['**']);
        return false;
      }
    }
    else {
      this.router.navigate(['**']);
      return false;
    }   
  }

}
