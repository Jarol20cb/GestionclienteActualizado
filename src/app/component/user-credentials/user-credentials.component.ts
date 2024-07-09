import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router'; // Importa Router desde @angular/router
import { LoginService } from 'src/app/service/login.service';
import { CerrarSesionComponent } from '../dialogo/cerrar-sesion/cerrar-sesion.component';
import { Registro } from 'src/app/model/registro';

@Component({
  selector: 'app-user-credentials',
  templateUrl: './user-credentials.component.html',
  styleUrls: ['./user-credentials.component.css']
})
export class UserCredentialsComponent implements OnInit {
  user: Registro = new Registro();
  error: string;

  constructor(private loginService: LoginService, private dialog: MatDialog, private router: Router) {
    this.error = ''; // Inicialización de la propiedad error
  }

  ngOnInit(): void {
    this.getUserDetails();
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

  cerrar() {
    const dialogRef = this.dialog.open(CerrarSesionComponent, {
      width: '300px',
      data: { mensaje: '¿Estás seguro de cerrar la sesión?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
