import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicModule } from './public/public.module';
import { SecureComponent } from './secure/secure.component';
import { HttpClientModule } from '@angular/common/http';

import { DashboardComponent } from './dashboard/dashboard.component';

import { ClientesListComponent } from './clientes/components/clientes-list/clientes-list.component';
import { ClientesNewComponent } from './clientes/components/clientes-new/clientes-new.component';
import { ClientesInfoComponent } from './clientes/components/clientes-info/clientes-info.component';

import { TrabajosListComponent } from './trabajos/components/trabajos-list/trabajos-list.component';
import { TrabajosInfoComponent } from './trabajos/components/trabajos-info/trabajos-info.component';
import { TrabajosNewComponent } from './trabajos/components/trabajos-new/trabajos-new.component';

import { UsuariosListComponent } from './usuarios/components/usuarios-list/usuarios-list.component';
import { ReactiveFormsModule } from '@angular/forms';

import { GoogleMapsModule } from '@angular/google-maps';
//import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { DatePipe } from '@angular/common';
import { UserDataSession } from './global';


@NgModule({
  declarations: [
    AppComponent,
    SecureComponent,
    DashboardComponent,
    ClientesNewComponent,
    ClientesListComponent,
    ClientesInfoComponent,
    TrabajosListComponent,
    TrabajosInfoComponent,
    TrabajosNewComponent,
    UsuariosListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PublicModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    GoogleMapsModule,
  ],
  providers: [DatePipe, UserDataSession],
  bootstrap: [AppComponent]
})
export class AppModule { }
