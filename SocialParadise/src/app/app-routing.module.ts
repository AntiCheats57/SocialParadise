import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactenosComponent } from './components/contactenos/contactenos.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoguearseComponent } from './components/loguearse/loguearse.component';
import { RegistrarseComponent } from './components/registrarse/registrarse.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { LugarTuristicoComponent } from './components/lugar-turistico/lugar-turistico.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AdminComponent } from './components/admin/admin.component';
import { EdicionLugarComponent } from './components/edicion-lugar/edicion-lugar.component';
import { EdicionNoticiaComponent } from './components/edicion-noticia/edicion-noticia.component';
import { AdminNoticiaComponent } from './components/admin-noticia/admin-noticia.component';
import { AdminLugarComponent } from './components/admin-lugar/admin-lugar.component';
import { AdminEditorComponent } from './components/admin-editor/admin-editor.component';
import {AuthGuard} from '../app/guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AsignarLugarComponent } from './components/asignar-lugar/asignar-lugar.component';


const routes: Routes = [
  {path : '', component: InicioComponent},
  {path : 'servicios', component: ServiciosComponent},
  {path : 'nosotros', component: NosotrosComponent},
  {path : 'contactenos', component: ContactenosComponent},
  {path : 'lugar', component: LugarTuristicoComponent},
  {path : 'loguearse', component: LoguearseComponent},
  {path : 'registrarse', component: RegistrarseComponent},
  {path : 'admin', component: InicioComponent, children:[
    {path : 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
    {path : 'noticias', component: AdminNoticiaComponent, 
      children:[
        {path : 'editar', component: EdicionNoticiaComponent, children:[], canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'}},    
        {path : 'nuevo', component: EdicionNoticiaComponent, children:[], canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'}}
      ], canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'}
    },
    {path : 'lugares', component: AdminLugarComponent, 
      children:[
        {path : 'editar', component: AsignarLugarComponent, children:[], canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'}},    
        {path : 'nuevo', component: AsignarLugarComponent, children:[], canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'}}
      ], canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'}
    },
    {path : 'lugar', component: AdminEditorComponent, 
      children:[
        {path : 'editar', component: EdicionLugarComponent, children:[], canActivate: [AuthGuard, RoleGuard], data: {role: 'editor'}},    
        {path : 'nuevo', component: EdicionLugarComponent, children:[], canActivate: [AuthGuard, RoleGuard], data: {role: 'editor'}}
      ], canActivate: [AuthGuard, RoleGuard], data: {role: 'editor'}
    }
  ]
},
  {path : '**', component: InicioComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
