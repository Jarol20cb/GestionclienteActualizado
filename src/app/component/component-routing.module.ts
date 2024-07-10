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
import { ListarperfilComponent } from './perfiles/listarperfil/listarperfil.component';
import { CreacionPerfilComponent } from './perfiles/creacion-perfil/creacion-perfil.component';
import { CreacionProveedorComponent } from './proveedores/creacion-proveedor/creacion-proveedor.component';
import { ListarProveedorComponent } from './proveedores/listar-proveedor/listar-proveedor.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { ListarPerfilesComponent } from './services/listar-perfiles/listar-perfiles.component';
import { GuardService } from '../service/guard.service';
import { BienvenidaComponent } from './vistas/bienvenida/bienvenida.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [GuardService] // Proteger la ruta 'home' con el guardia
  },
  {
    path: 'credentials',
    component: UserCredentialsComponent,
    canActivate: [GuardService] // Proteger la ruta 'credentials' con el guardia
  },
  {
    path: 'reporte',
    component: VisualizarPagosComponent,
    canActivate: [GuardService] // Proteger la ruta 'reporte' con el guardia
  },
  {
    path: 'servicios',
    component: ServicesComponent,
    canActivate: [GuardService], // Proteger la ruta 'servicios' con el guardia
    children:[
      { path: 'nuevo', component: CreacionServicioComponent },
      { path: 'ediciones/:id', component: CreacionServicioComponent },
      { path: ':serviceId/perfiles', component: ListarPerfilesComponent }
    ]
  },
  {
    path: 'custser',
    component: CustomerserviceComponent,
    canActivate: [GuardService], // Proteger la ruta 'custser' con el guardia
    children:[
      { path: 'nuevo', component: CreacionCsComponent },
      { path: 'ediciones/:id', component: CreacionCsComponent },
    ]
  },
  {
    path: 'socios',
    component: SocioComponent,
    canActivate: [GuardService], // Proteger la ruta 'socios' con el guardia
    children:[
      { path: 'nuevo', component: CreacionSocioComponent },
      { path: 'ediciones/:id', component: CreacionSocioComponent },
      { path: ':socioId/clientes', component: ListarClientesSocioComponent },
    ]
  },
  {
    path: 'perfil',
    component: PerfilesComponent,
    canActivate: [GuardService], // Proteger la ruta 'perfil' con el guardia
    children:[
      { path: 'nuevo', component: CreacionPerfilComponent },
      { path: 'ediciones/:id', component: CreacionPerfilComponent },
    ]
  },
  {
    path: 'proveedor',
    component: ProveedoresComponent,
    canActivate: [GuardService], // Proteger la ruta 'proveedor' con el guardia
    children:[
      { path: 'nuevo', component: CreacionProveedorComponent },
      { path: 'ediciones/:id', component: CreacionProveedorComponent },
    ]
  },
  {
    path: 'bienvenida',
    component: BienvenidaComponent,
    canActivate: [GuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule { }
