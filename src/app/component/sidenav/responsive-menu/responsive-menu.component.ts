import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Registro } from 'src/app/model/registro';
import { LoginService } from 'src/app/service/login.service';

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

  constructor(private router: Router, private loginService: LoginService) {}

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
    // Aquí puedes implementar la lógica para cerrar sesión.
    this.menuOpen = false;
    this.submenuActive = null;
    this.router.navigate(['/login']);
  }
}
