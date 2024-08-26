import { Component, HostListener, OnInit } from '@angular/core';
import { Registro } from 'src/app/model/registro';
import { LoginService } from 'src/app/service/login.service';
import { CerrarSesionComponent } from '../dialogo/cerrar-sesion/cerrar-sesion.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  active: string = 'dashboard';
  role: string = "";
  username: string = "";
  user: Registro = new Registro();
  error: string = "";
  submenuActive: string = '';
  isResponsive: boolean = false;

  constructor(private loginService: LoginService, private dialog: MatDialog, private router: Router) {}

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const sidenav = document.getElementById("sidenav");
    if (sidenav && !sidenav.contains(event.target as Node) && sidenav.classList.contains('open')) {
      this.closeNav();
    }
  }

  ngOnInit() {
    this.checkWindowSize();
    this.loadUserDetails();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowSize();
  }

  loadUserDetails() {
    this.loginService.getUserDetails().subscribe(
      data => {
        this.user = data;
        this.role = this.loginService.showRole();
        this.username = this.loginService.showUser();
      },
    );
  }

  checkWindowSize() {
    this.isResponsive = window.innerWidth <= 768;
    const sidenav = document.getElementById("sidenav");
    const mainContent = document.getElementById("main-content");
    if (this.isResponsive) {
      sidenav?.classList.add("responsive");
      mainContent?.classList.add("responsive");
      this.closeNav();
    } else {
      sidenav?.classList.remove("responsive");
      mainContent?.classList.remove("responsive");
      this.openNav();
    }
  }

  toggleNav() {
    const sidenav = document.getElementById("sidenav");
    const mainContent = document.getElementById("main-content");
    sidenav?.classList.toggle("open");
    if (sidenav?.classList.contains('open')) {
      sidenav?.classList.remove("closed");
      mainContent?.classList.add("responsive");
    } else {
      sidenav?.classList.add("closed");
      mainContent?.classList.remove("responsive");
      this.submenuActive = '';
    }
  }

  openNav() {
    const sidenav = document.getElementById("sidenav");
    const mainContent = document.getElementById("main-content");
    sidenav?.classList.remove("closed");
    sidenav?.classList.add("open");
    mainContent?.classList.remove("closed");
  }

  closeNav() {
    const sidenav = document.getElementById("sidenav");
    const mainContent = document.getElementById("main-content");
    sidenav?.classList.add("closed");
    sidenav?.classList.remove("open");
    mainContent?.classList.add("closed");
    this.submenuActive = '';
  }

  setActive(tab: string) {
    this.active = tab;
    this.openNav();
  }

  toggleSubmenu(tab: string) {
    this.submenuActive = this.submenuActive === tab ? '' : tab;
  }

  verificar() {
    return this.loginService.verificar();
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
