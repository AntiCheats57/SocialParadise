import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactenosComponent } from 'src/app/components/contactenos/contactenos.component';
import { NosotrosComponent } from 'src/app/components/nosotros/nosotros.component';
import { InicioComponent } from 'src/app/components/inicio/inicio.component';
import { LoguearseComponent } from 'src/app/components/loguearse/loguearse.component';
import { RegistrarseComponent } from 'src/app/components/registrarse/registrarse.component';
import { ServiciosComponent } from 'src/app/components/servicios/servicios.component';
import { LugarTuristicoComponent } from 'src/app/components/lugar-turistico/lugar-turistico.component';
import { PerfilComponent } from 'src/app/components/perfil/perfil.component';
import { EdicionLugarComponent } from 'src/app/components/edicion-lugar/edicion-lugar.component';
import { EdicionNoticiaComponent } from 'src/app/components/edicion-noticia/edicion-noticia.component';
import { AdminNoticiaComponent } from 'src/app/components/admin-noticia/admin-noticia.component';
import { AdminLugarComponent } from 'src/app/components/admin-lugar/admin-lugar.component';
import { AdminEditorComponent } from 'src/app/components/admin-editor/admin-editor.component';
import { AsignarLugarComponent } from 'src/app/components/asignar-lugar/asignar-lugar.component';
import { ErrorComponent } from 'src/app/components/error/error.component';

import { AuthGuard } from 'src/app/guards/auth/auth.guard';
import { RoleGuard } from 'src/app/guards/role/role.guard';

const routes: Routes = [
  {path : '', component: InicioComponent},
  {path : 'nosotros', component: NosotrosComponent},
  {path : 'servicios', component: ServiciosComponent},
  {path : 'contactenos', component: ContactenosComponent},
  {path : 'lugar/:id', component: LugarTuristicoComponent},
  {path : 'loguearse', component: LoguearseComponent},
  {path : 'registrarse', component: RegistrarseComponent},
  {path : 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
  {path : 'noticias', component: AdminNoticiaComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'}, children: [
    {path : 'nuevo', component: EdicionNoticiaComponent},
    {path : 'editar/:id', component: EdicionNoticiaComponent}
  ]},
  {path : 'asignacionLugares', component: AdminLugarComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'}, children: [
    {path : 'nuevo', component: AsignarLugarComponent},
    {path : 'editar/:id', component: AsignarLugarComponent}
  ]},
  {path : 'lugares', component: AdminEditorComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'editor'}, children: [
    {path : 'editar/:id', component: EdicionLugarComponent}
  ]},
{path : '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
