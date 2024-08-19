import { Component, OnInit } from '@angular/core';
import { CerrarSesionComponent } from '../../dialogo/cerrar-sesion/cerrar-sesion.component';
import { LoginService } from 'src/app/service/login.service';
import { Registro } from 'src/app/model/registro';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit{

  user: Registro = new Registro();
  error: string = "";
  role: string = "";
  username: string = "";

  constructor(private loginService: LoginService, private dialog: MatDialog, private router: Router) { }

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


  preventClose(event: MouseEvent) {
    event.stopPropagation();
  }
}
