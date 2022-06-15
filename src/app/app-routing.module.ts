import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { SecureComponent } from './secure/secure.component';
import { LoginComponent } from './public/login/login.component'; 

import { DashboardComponent } from './dashboard/dashboard.component';

import { ClientesListComponent } from './clientes/components/clientes-list/clientes-list.component';
import { ClientesNewComponent } from './clientes/components/clientes-new/clientes-new.component';
import { ClientesInfoComponent } from './clientes/components/clientes-info/clientes-info.component';

import { TrabajosListComponent } from './trabajos/components/trabajos-list/trabajos-list.component';
import { TrabajosNewComponent } from './trabajos/components/trabajos-new/trabajos-new.component';
import { TrabajosInfoComponent } from './trabajos/components/trabajos-info/trabajos-info.component';

import { UsuariosListComponent } from './usuarios/components/usuarios-list/usuarios-list.component';


const routes: Routes = [
  /*{path: 'public', component: PublicComponent},*/
  {
    path: '', 
    component: PublicComponent,
    children: [
      {path: '', component: LoginComponent},
      {path: 'login', component: LoginComponent}
    ]
  },
  {path: 'secure', component: SecureComponent},

  {path: 'dashboard', component: DashboardComponent},

  {path: 'clientes', component: ClientesListComponent},
  {path: 'newCliente', component: ClientesNewComponent},
  {path: 'clientes/:id', component: ClientesInfoComponent},

  {path: 'trabajos', component: TrabajosListComponent},
  {path: 'newTrabajo', component: TrabajosNewComponent},
  {path: 'trabajos/:id', component: TrabajosInfoComponent},

  {path: 'usuarios', component: UsuariosListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
