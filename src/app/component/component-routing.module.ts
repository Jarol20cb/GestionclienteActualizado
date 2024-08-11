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
import { ListarPerfilClienteComponent } from './services/perfiles/perfil-cliente/listar-perfil-cliente/listar-perfil-cliente.component';
import { CrearPerfilClienteComponent } from './services/perfiles/perfil-cliente/crear-perfil-cliente/crear-perfil-cliente.component';
import { NotificacionComponent } from './administracion/notificacion/notificacion.component';
import { GuiaUsuarioComponent } from './administracion/guia-usuario/guia-usuario.component';
import { RegistroClienteComponent } from '../wizard/registro-cliente/registro-cliente.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { CustomerOverviewComponent } from './componentesvista/customer/customer-overview/customer-overview.component';
import { CustomerEditComponent } from './componentescreaedita/customer-edit/customer-edit.component';
import { ProveedoreditComponent } from './componentescreaedita/proveedoredit/proveedoredit.component';
import { SocioeditComponent } from './componentescreaedita/socioedit/socioedit.component';
import { ServicioeditComponent } from './componentescreaedita/servicioedit/servicioedit.component';
import { PerfileditComponent } from './componentescreaedita/perfiledit/perfiledit.component';
import { CustomerDetailComponent } from './componentesvista/customer/customer-detail/customer-detail.component';
import { PerfilesOverviewComponent } from './componentesvista/perfiles/perfiles-overview/perfiles-overview.component';
import { PerfilesDetailComponent } from './componentesvista/perfiles/perfiles-detail/perfiles-detail.component';
import { ServiciosOverviewComponent } from './componentesvista/servicios/servicios-overview/servicios-overview.component';
import { PresentationComponent } from './componentesvista/socios-proveedores/presentation/presentation.component';
import { NotificationAdminComponent } from './administracion/notification-admin/notification-admin.component';
import { MensajesPersonalizadosComponent } from './componentesvista/customer/mensajes-personalizados/mensajes-personalizados.component';

const routes: Routes = [

  {
    path: '',
    component: SidenavComponent, // Usa LayoutComponent como contenedor
    canActivate: [GuardService],
    children: [
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
          { path: ':serviceId/perfilesservice/ediciones/:perfilId', component: GestorperfilescrearComponent }, // Ruta para editar perfil
          { path: ':serviceId/perfilesservice/:perfilId/listar-perfil-cliente', component: ListarPerfilClienteComponent },
          { path: ':serviceId/perfilesservice/:perfilId/crear-perfil-cliente', component: CrearPerfilClienteComponent },
          { path: ':serviceId/perfilesservice/:perfilId/editar-perfil-cliente/:clienteId', component: CrearPerfilClienteComponent }, 
    
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
    
      {
        path: 'notifications',
        component: NotificacionComponent,
        canActivate: [GuardService]
      },
      { path: 'guiausuario', component: GuiaUsuarioComponent },
    
      { path: 'wizard', component: RegistroClienteComponent },

      { path: 'adminnotificactions', component: NotificationAdminComponent },

      { path: 'mensajes', component: MensajesPersonalizadosComponent },


      //********************componentes de vista********************//
      
      { path: 'customer-overview', component: CustomerOverviewComponent },
      { path: 'customer-detail/:id', component: CustomerDetailComponent },


      { path: 'perfil-overview', component: PerfilesOverviewComponent },
      { path: 'perfil-detail/:id', component: PerfilesDetailComponent },

      { path: 'servicios-overview', component: ServiciosOverviewComponent },

      { path: 'socioproveedor-overview', component: PresentationComponent },
      
      

      //********************componentes de edicion********************//

      { path: 'customeredit/:id', component: CustomerEditComponent },
      { path: 'customeredit/nuevo', component: CustomerEditComponent },

      { path: 'proveedoredit/:id', component: ProveedoreditComponent },
      { path: 'proveedoredit/nuevo', component: ProveedoreditComponent },

      { path: 'socioedit/:id', component: SocioeditComponent },
      { path: 'socioedit/nuevo', component: SocioeditComponent },

      { path: 'servicioedit/:id', component: ServicioeditComponent },
      { path: 'servicioedit/nuevo', component: ServicioeditComponent },

      { path: 'perfiledit/:id', component: PerfileditComponent },
      { path: 'perfiledit/nuevo', component: PerfileditComponent },
      


      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Ruta por defecto
      { path: '**', redirectTo: 'home' } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule { }
