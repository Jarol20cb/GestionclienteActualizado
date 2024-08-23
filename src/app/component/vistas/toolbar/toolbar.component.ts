import { Component, OnInit } from '@angular/core';
import { NotificacionService } from 'src/app/service/notificacion.service';
import { Registro } from 'src/app/model/registro';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd, Event } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  user: Registro = new Registro();
  unreadCount: number = 0;
  error: string = "";
  role: string = "";
  username: string = "";
  showBackButton: boolean = false;

  constructor(
    private loginService: LoginService, 
    private dialog: MatDialog, 
    private router: Router, 
    private notificationService: NotificacionService,
    private location: Location
  ) { }

  ngOnInit() {
    this.verificar();
    this.loginService.user$.subscribe(user => this.user = user);
    this.getUserDetails();
    this.getUnreadCount();
    this.checkBackButtonVisibility(this.router.url);

    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkBackButtonVisibility(event.urlAfterRedirects);
    });
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

  getUnreadCount() {
    this.notificationService.getUnreadCount().subscribe(
      count => this.unreadCount = count,
      error => console.error('Error al obtener el conteo de notificaciones no leídas', error)
    );
  }

  markAllNotificationsAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.unreadCount = 0;
    });
  }

  preventClose(event: MouseEvent) {
    event.stopPropagation();
  }

  goBack(): void {
    this.location.back();
  }

  checkBackButtonVisibility(url: string): void {
    this.showBackButton = url !== '/components/home';
  }
}
