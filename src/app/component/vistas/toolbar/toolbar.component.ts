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

    document.addEventListener('click', this.closeAllDropdowns.bind(this));
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
        this.router.navigate(['/login']);
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

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    const dropdown = (event.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
    const isOpen = dropdown.style.display === 'block';
    this.closeAllDropdowns();
    if (!isOpen) {
      dropdown.style.display = 'block';
    }
  }

  closeDropdown() {
    this.closeAllDropdowns();
  }

  closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => {
      (dropdown as HTMLElement).style.display = 'none';
    });
  }

  preventClose(event: MouseEvent) {
    event.stopPropagation();
  }
}
