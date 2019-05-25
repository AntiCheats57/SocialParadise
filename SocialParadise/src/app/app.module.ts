import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { NgbdSortableHeader } from '../app/directives/sortable.directive';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactenosComponent } from './components/contactenos/contactenos.component';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { FooterComponent } from './components/footer/footer.component';
import { CaracteristicasComponent } from './components/caracteristicas/caracteristicas.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { EquipoComponent } from './components/equipo/equipo.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { LoguearseComponent } from './components/loguearse/loguearse.component';
import { BtnSocialComponent } from './components/btn-social/btn-social.component';
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
import { AsignarLugarComponent } from './components/asignar-lugar/asignar-lugar.component';
import { ComentarioComponent } from './components/comentario/comentario.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';

import { FilterPipe} from './pipe/filter.pipe';
import { ErrorComponent } from './components/error/error.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ContactenosComponent,
    NavegacionComponent,
    FooterComponent,
    CaracteristicasComponent,
    NosotrosComponent,
    EquipoComponent,
    InicioComponent,
    CarouselComponent,
    LoguearseComponent,
    BtnSocialComponent,
    RegistrarseComponent,
    ServiciosComponent,
    LugarTuristicoComponent,
    PerfilComponent,
    AdminComponent,
    EdicionLugarComponent,
    EdicionNoticiaComponent,
    AdminNoticiaComponent,
    AdminLugarComponent,
    AdminEditorComponent,
    NgbdSortableHeader, 
    AsignarLugarComponent,
    ComentarioComponent, 
    FilterPipe, 
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule ,
    AngularFireDatabaseModule,
    AngularFireStorageModule,   
  ],
  providers: [AngularFireAuth, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
