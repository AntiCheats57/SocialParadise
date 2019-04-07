import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactenosComponent } from './components/contactenos/contactenos.component';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { FooterComponent } from './components/footer/footer.component';
import { PruebasComponent } from './components/pruebas/pruebas.component';
import { CaracteristicasComponent } from './components/caracteristicas/caracteristicas.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { EquipoComponent } from './components/equipo/equipo.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CarouselComponent } from './components/carousel/carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactenosComponent,
    NavegacionComponent,
    FooterComponent,
    PruebasComponent,
    CaracteristicasComponent,
    NosotrosComponent,
    EquipoComponent,
    InicioComponent,
    CarouselComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
