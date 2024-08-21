import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Registro } from 'src/app/model/registro';
import { LoginService } from 'src/app/service/login.service';
import { CerrarSesionComponent } from '../../dialogo/cerrar-sesion/cerrar-sesion.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-responsive-menu',
  templateUrl: './responsive-menu.component.html',
  styleUrls: ['./responsive-menu.component.css']
})
export class ResponsiveMenuComponent implements OnInit{
  @Input() role: string = '';
  menuOpen: boolean = false;
  submenuActive: string | null = null;
  user: Registro = new Registro();
  username: string = "";
  error: string = "";

  constructor(private router: Router,private dialog: MatDialog, private loginService: LoginService) {}

  ngOnInit() {
    this.loadUserDetails();
  }
  
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleSubmenu(menu: string) {
    this.submenuActive = this.submenuActive === menu ? null : menu;
  }

  navigate(route: string) {
    this.menuOpen = false;
    this.submenuActive = null;
    this.router.navigate([`/components/${route}`]);
  }

  loadUserDetails() {
    this.loginService.getUserDetails().subscribe(
      data => {
        this.user = data;
        this.role = this.loginService.showRole();
        this.username = this.loginService.showUser();
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
