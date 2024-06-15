import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserCredentialsComponent } from './user-credentials/user-credentials.component';
import { CreacionServicioComponent } from './services/creacion-servicio/creacion-servicio.component';
import { ServicesComponent } from './services/services.component';
import { CreacionCsComponent } from './customerservice/creacion-cs/creacion-cs.component';
import { CustomerserviceComponent } from './customerservice/customerservice.component';
import { VisualizarPagosComponent } from './visualizar-pagos/visualizar-pagos.component';


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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule { }
