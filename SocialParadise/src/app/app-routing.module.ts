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

const routes: Routes = [
  {path : '', component: InicioComponent},
  {path : 'servicios', component: ServiciosComponent},
  {path : 'nosotros', component: NosotrosComponent},
  {path : 'contactenos', component: ContactenosComponent},
  {path : 'lugar', component: LugarTuristicoComponent},
  {path : 'loguearse', component: LoguearseComponent},
  {path : 'registrarse', component: RegistrarseComponent},
  {path : 'admin', component: InicioComponent, children:[
    {path : 'perfil', component: PerfilComponent},
    {path : 'noticias', component: AdminNoticiaComponent, children:[
      {path : 'editar', component: EdicionNoticiaComponent, children:[]},    
      {path : 'nuevo', component: EdicionNoticiaComponent, children:[]}
    ]},
    {path : 'lugares', component: AdminNoticiaComponent, children:[
      {path : 'editar', component: EdicionNoticiaComponent, children:[]},    
      {path : 'nuevo', component: EdicionNoticiaComponent, children:[]}
    ]},
    {path : 'lugar', component: AdminEditorComponent, children:[
      {path : 'editar', component: EdicionLugarComponent, children:[]},    
      {path : 'nuevo', component: EdicionLugarComponent, children:[]}
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
