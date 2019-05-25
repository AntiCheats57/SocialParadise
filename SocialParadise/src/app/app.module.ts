import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader } from 'src/app/directives/sortable.directive';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { ContactenosComponent } from 'src/app/components/contactenos/contactenos.component';
import { NavegacionComponent } from 'src/app/components/navegacion/navegacion.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { CaracteristicasComponent } from 'src/app/components/caracteristicas/caracteristicas.component';
import { NosotrosComponent } from 'src/app/components/nosotros/nosotros.component';
import { EquipoComponent } from 'src/app/components/equipo/equipo.component';
import { InicioComponent } from 'src/app/components/inicio/inicio.component';
import { CarouselComponent } from 'src/app/components/carousel/carousel.component';
import { LoguearseComponent } from 'src/app/components/loguearse/loguearse.component';
import { BtnSocialComponent } from 'src/app/components/btn-social/btn-social.component';
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
import { ComentarioComponent } from 'src/app/components/comentario/comentario.component';
import { ErrorComponent } from 'src/app/components/error/error.component';
import { FilterPipe} from 'src/app/pipe/filter.pipe';

import { AuthService } from 'src/app/services/auth/auth.service';
import { EditorService } from 'src/app/services/editor/editor.service';
import { LocalDataService } from 'src/app/services/local-data/local-data.service';
import { LugaresService } from 'src/app/services/lugares/lugares.service';
import { NoticiasService } from 'src/app/services/noticias/noticias.service';
import { AuthGuard } from 'src/app/guards/auth/auth.guard';
import { RoleGuard } from 'src/app/guards/role/role.guard';
import { HomeComponent } from './components/home/home.component';

import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';

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
    EdicionLugarComponent,
    EdicionNoticiaComponent,
    AdminNoticiaComponent,
    AdminLugarComponent, 
    AdminEditorComponent,
    NgbdSortableHeader, 
    AsignarLugarComponent,
    ComentarioComponent, 
    FilterPipe, 
    ErrorComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule ,
    AngularFireDatabaseModule,
    AngularFireStorageModule,   
  ],
  providers: [
    AuthService,
    EditorService,
    LocalDataService,
    LugaresService,
    NoticiasService,
    AuthGuard,
    RoleGuard, 
    AngularFireAuth, 
    AngularFirestore
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
