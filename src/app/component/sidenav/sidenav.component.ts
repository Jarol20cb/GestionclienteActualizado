import { Component, HostListener, OnInit } from '@angular/core';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{
  active: string = 'dashboard';
  role:string="";
  username:string=""
  constructor(private loginService: LoginService){}

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const sidenav = document.getElementById("sidenav");
    if (sidenav && !sidenav.contains(event.target as Node) && sidenav.classList.contains('open')) {
      this.closeNav();
    }
  }

  ngOnInit() {
    this.checkWindowSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowSize();
  }

  checkWindowSize() {
    const sidenav = document.getElementById("sidenav");
    const mainContent = document.getElementById("main-content");
    if (window.innerWidth <= 768) {
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
  }

  setActive(tab: string) {
    this.active = tab;
    this.openNav(); // Asegúrate de que la barra lateral se abra cuando se seleccione un tab
  }

  verificar() {
    this.role=this.loginService.showRole();
    this.username=this.loginService.showUser();
    return this.loginService.verificar();
  }
}
