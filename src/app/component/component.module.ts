import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import{MatIconModule} from '@angular/material/icon'
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogComponent } from './dialogo/dialog/dialog.component';
import { CerrarSesionComponent } from './dialogo/cerrar-sesion/cerrar-sesion.component';
import { UserCredentialsComponent } from './user-credentials/user-credentials.component';
import { ConfirmDialogComponent } from './dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ComponentRoutingModule } from './component-routing.module';
import { ServicesComponent } from './services/services.component';
import { CreacionServicioComponent } from './services/creacion-servicio/creacion-servicio.component';
import { ListarServicioComponent } from './services/listar-servicio/listar-servicio.component';
import { CustomerserviceComponent } from './customerservice/customerservice.component';
import { ListarCsComponent } from './customerservice/listar-cs/listar-cs.component';
import { CreacionCsComponent } from './customerservice/creacion-cs/creacion-cs.component';
import { MatCardModule } from '@angular/material/card';
import { VisualizarPagosComponent } from './visualizar-pagos/visualizar-pagos.component'
import { MatExpansionModule } from '@angular/material/expansion';
import { NotificationComponent } from './notification/notification.component';
import { ConfirmarRenovacionDialogComponent } from './confirmar-renovacion-dialog/confirmar-renovacion-dialog.component';
import { WarningDialogComponent } from './dialogo/warning-dialog/warning-dialog.component';
import { SocioComponent } from './socio/socio.component';
import { CreacionSocioComponent } from './socio/creacion-socio/creacion-socio.component';
import { ListarClientesSocioComponent } from './socio/listar-clientes-socio/listar-clientes-socio.component';
import { ListarSociosComponent } from './socio/listar-socios/listar-socios.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { ListarperfilComponent } from './perfiles/listarperfil/listarperfil.component';
import { CreacionPerfilComponent } from './perfiles/creacion-perfil/creacion-perfil.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ListarProveedorComponent } from './proveedores/listar-proveedor/listar-proveedor.component';
import { CreacionProveedorComponent } from './proveedores/creacion-proveedor/creacion-proveedor.component';
import { ListarPerfilesComponent } from './services/listar-perfiles/listar-perfiles.component';
import { BienvenidaComponent } from './vistas/bienvenida/bienvenida.component';
import { ToolbarComponent } from './vistas/toolbar/toolbar.component';
import { GestorPerfilesComponent } from './services/perfiles/gestor-perfiles/gestor-perfiles.component';
import { ListarClientesComponent } from './services/perfiles/listar-clientes/listar-clientes.component';
import { PerfilClienteComponent } from './services/perfiles/perfil-cliente/perfil-cliente.component';
import { UserListComponent } from './administracion/user-list/user-list.component';
import { NotificationAdministracionComponent } from './administracion/notificationadministracion/notificationadministracion.component';
import { CreayeditaadministracionComponent } from './administracion/creayeditaadministracion/creayeditaadministracion.component';
import { GestorperfileslistarComponent } from './services/perfiles/gestor-perfiles/gestorperfileslistar/gestorperfileslistar.component';
import { GestorperfilescrearComponent } from './services/perfiles/gestor-perfiles/gestorperfilescrear/gestorperfilescrear.component';
import { CrearPerfilClienteComponent } from './services/perfiles/perfil-cliente/crear-perfil-cliente/crear-perfil-cliente.component';
import { ListarPerfilClienteComponent } from './services/perfiles/perfil-cliente/listar-perfil-cliente/listar-perfil-cliente.component';
import { NotificacionComponent } from './administracion/notificacion/notificacion.component';
import { GuiaUsuarioComponent } from './administracion/guia-usuario/guia-usuario.component';
import { RegistroClienteComponent } from '../wizard/registro-cliente/registro-cliente.component';
import { RegistroSocioComponent } from '../wizard/registro-socio/registro-socio.component';
import { RegistroProveedorComponent } from '../wizard/registro-proveedor/registro-proveedor.component';
import { RegistroServicioComponent } from '../wizard/registro-servicio/registro-servicio.component';
import { RegistroPerfilesComponent } from '../wizard/registro-perfiles/registro-perfiles.component';
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
import { DurationPipe } from './administracion/user-list/duration.pipe';
import { RegistrationStep1Component } from './registro/registration-step1/registration-step1.component';
import { RegistrationStep2Component } from './registro/registration-step2/registration-step2.component';
import { BannerComponent } from './vistas/banner/banner.component';
import { BannerManagerComponent } from './vistas/banner-manager/banner-manager.component';

@NgModule({
  declarations: [
    DialogComponent,
    CerrarSesionComponent,
    UserCredentialsComponent,
    ConfirmDialogComponent,
    HomeComponent,
    LoginComponent,
    RegistroComponent,
    ServicesComponent,
    CreacionServicioComponent,
    ListarServicioComponent,
    CustomerserviceComponent,
    ListarCsComponent,
    CreacionCsComponent,
    VisualizarPagosComponent,
    NotificationComponent,
    ConfirmarRenovacionDialogComponent,
    WarningDialogComponent,
    SocioComponent,
    CreacionSocioComponent,
    ListarClientesSocioComponent,
    ListarSociosComponent,
    PerfilesComponent,
    ListarperfilComponent,
    CreacionPerfilComponent,
    ProveedoresComponent,
    ListarProveedorComponent,
    CreacionProveedorComponent,
    ListarPerfilesComponent,
    BienvenidaComponent,
    ToolbarComponent,
    GestorPerfilesComponent,
    ListarClientesComponent,
    PerfilClienteComponent,
    UserListComponent,
    NotificationAdministracionComponent,
    CreayeditaadministracionComponent,
    GestorperfileslistarComponent,
    GestorperfilescrearComponent,
    CrearPerfilClienteComponent,
    ListarPerfilClienteComponent,
    NotificacionComponent,
    GuiaUsuarioComponent,
    RegistroClienteComponent,
    RegistroSocioComponent,
    RegistroProveedorComponent,
    RegistroServicioComponent,
    RegistroPerfilesComponent,
    SidenavComponent,
    CustomerOverviewComponent,
    CustomerDetailComponent,
    CustomerEditComponent,
    ProveedoreditComponent,
    SocioeditComponent,
    ServicioeditComponent,
    PerfileditComponent,
    PerfilesOverviewComponent,
    PerfilesDetailComponent,
    ServiciosOverviewComponent,
    PresentationComponent,
    NotificationAdminComponent,
    MensajesPersonalizadosComponent,
    DurationPipe,
    RegistrationStep1Component,
    RegistrationStep2Component,
    BannerComponent,
    BannerManagerComponent,

  ],
  imports: [
    CommonModule,
    ComponentRoutingModule,
    
    HttpClientModule,
    MatListModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatDialogModule,
    RouterModule,
    MatCardModule,
    MatExpansionModule

  ]
})
export class ComponentModule { }
