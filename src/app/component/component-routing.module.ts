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

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'credentials',
    component: UserCredentialsComponent
  },
  {
    path: 'reporte',
    component: VisualizarPagosComponent
  },
  {
    path: 'servicios',
    component: ServicesComponent, children:[
      { path: 'nuevo', component: CreacionServicioComponent },
      { path: 'ediciones/:id', component: CreacionServicioComponent },
    ]
  },
  {
    path: 'custser',
    component: CustomerserviceComponent, children:[
      { path: 'nuevo', component: CreacionCsComponent },
      { path: 'ediciones/:id', component: CreacionCsComponent },
    ]
  },
  {
    path: 'socios',
    component: SocioComponent, children:[
      { path: 'nuevo', component: CreacionSocioComponent },
      { path: 'ediciones/:id', component: CreacionSocioComponent },
      { path: ':socioId/clientes', component: ListarClientesSocioComponent },
    ]
  },

  {
    path: 'perfil',
    component: PerfilesComponent, children:[
      { path: 'nuevo', component: CreacionPerfilComponent },
      { path: 'ediciones/:id', component: CreacionPerfilComponent },
    ]
  },
  {
    path: 'proveedor',
    component: ProveedoresComponent, children:[
      { path: 'nuevo', component: CreacionProveedorComponent },
      { path: 'ediciones/:id', component: CreacionProveedorComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule { }
