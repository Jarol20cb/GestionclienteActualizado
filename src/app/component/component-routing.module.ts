import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserCredentialsComponent } from './user-credentials/user-credentials.component';
import { CreacionServicioComponent } from './services/creacion-servicio/creacion-servicio.component';
import { ServicesComponent } from './services/services.component';
import { CreacionCsComponent } from './customerservice/creacion-cs/creacion-cs.component';
import { CustomerserviceComponent } from './customerservice/customerservice.component';
import { VisualizarPagosComponent } from './visualizar-pagos/visualizar-pagos.component';
import { SocioComponent } from './socio/socio.component';
import { CreacionSocioComponent } from './socio/creacion-socio/creacion-socio.component';
import { ListarClientesSocioComponent } from './socio/listar-clientes-socio/listar-clientes-socio.component';
import { CreacionPerfilComponent } from './perfiles/creacion-perfil/creacion-perfil.component';
import { CreacionProveedorComponent } from './proveedores/creacion-proveedor/creacion-proveedor.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { GuardService } from '../service/guard.service';
import { BienvenidaComponent } from './vistas/bienvenida/bienvenida.component';
import { UserListComponent } from './administracion/user-list/user-list.component';
import { GestorperfileslistarComponent } from './services/perfiles/gestor-perfiles/gestorperfileslistar/gestorperfileslistar.component';
import { GestorperfilescrearComponent } from './services/perfiles/gestor-perfiles/gestorperfilescrear/gestorperfilescrear.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [GuardService]
  },
  {
    path: 'credentials',
    component: UserCredentialsComponent,
    canActivate: [GuardService]
  },
  {
    path: 'reporte',
    component: VisualizarPagosComponent,
    canActivate: [GuardService]
  },
  {
    path: 'servicios',
    component: ServicesComponent,
    canActivate: [GuardService],
    children: [
      { path: 'nuevo', component: CreacionServicioComponent },
      { path: 'ediciones/:id', component: CreacionServicioComponent },
      { path: ':serviceId/perfilesservice', component: GestorperfileslistarComponent },
      { path: ':serviceId/perfilesservice/crear', component: GestorperfilescrearComponent },
    ]
  },
  
  {
    path: 'custser',
    component: CustomerserviceComponent,
    canActivate: [GuardService],
    children:[
      { path: 'nuevo', component: CreacionCsComponent },
      { path: 'ediciones/:id', component: CreacionCsComponent },
    ]
  },
  {
    path: 'socios',
    component: SocioComponent,
    canActivate: [GuardService],
    children:[
      { path: 'nuevo', component: CreacionSocioComponent },
      { path: 'ediciones/:id', component: CreacionSocioComponent },
      { path: ':socioId/clientes', component: ListarClientesSocioComponent },
    ]
  },
  {
    path: 'perfil',
    component: PerfilesComponent,
    canActivate: [GuardService],
    children:[
      { path: 'nuevo', component: CreacionPerfilComponent },
      { path: 'ediciones/:id', component: CreacionPerfilComponent },
    ]
  },
  {
    path: 'proveedor',
    component: ProveedoresComponent,
    canActivate: [GuardService],
    children:[
      { path: 'nuevo', component: CreacionProveedorComponent },
      { path: 'ediciones/:id', component: CreacionProveedorComponent },
    ]
  },
  {
    path: 'bienvenida',
    component: BienvenidaComponent,
    canActivate: [GuardService]
  },

  { path: 'users', component: UserListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule { }
