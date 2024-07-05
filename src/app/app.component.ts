import { Component, OnInit } from '@angular/core';
import { LoginService } from './service/login.service';
import { MatDialog } from '@angular/material/dialog';
import { CerrarSesionComponent } from './component/dialogo/cerrar-sesion/cerrar-sesion.component';
import { Registro } from './model/registro';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GestionCliente';
  user: Registro = new Registro();
  error: string = "";

  role: string = "";
  username: string = "";

  constructor(private loginService: LoginService, private dialog: MatDialog) { }

  ngOnInit() {
    this.verificar();
    this.loginService.user$.subscribe(user => this.user = user);
    this.getUserDetails();
  }

  verificar() {
    this.role = this.loginService.showRole();
    this.username = this.loginService.showUser();
    return this.loginService.verificar();
  }

  validarRol() {
    return this.role === 'ADMIN' || this.role === 'USER';
  }

  cerrar() {
    const dialogRef = this.dialog.open(CerrarSesionComponent, {
      width: '300px',
      data: { mensaje: '¿Estás seguro de cerrar la sesión?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        sessionStorage.clear();
        window.location.href = '/login';
      }
    });
  }

  getUserDetails() {
    this.loginService.getUserDetails().subscribe(
      data => {
        this.user = data;
      },
      error => {
        this.error = error;
        console.error('Error al obtener los detalles del usuario', error);
      }
    );
  }
}
