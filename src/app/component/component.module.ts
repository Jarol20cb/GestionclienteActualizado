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
    ToolbarComponent
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
