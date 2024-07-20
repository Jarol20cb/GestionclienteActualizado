import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { RegistroSocioComponent } from './wizard/registro-socio/registro-socio.component';
import { RegistroProveedorComponent } from './wizard/registro-proveedor/registro-proveedor.component';
import { RegistroServicioComponent } from './wizard/registro-servicio/registro-servicio.component';
import { RegistroPerfilesComponent } from './wizard/registro-perfiles/registro-perfiles.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistroSocioComponent,
    RegistroProveedorComponent,
    RegistroServicioComponent,
    RegistroPerfilesComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatSnackBarModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
