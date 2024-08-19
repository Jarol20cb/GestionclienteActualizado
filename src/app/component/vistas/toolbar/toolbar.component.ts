import { Component, OnInit } from '@angular/core';
import { NotificacionService } from 'src/app/service/notificacion.service';
import { Registro } from 'src/app/model/registro';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';

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

  constructor(
    private loginService: LoginService, 
    private dialog: MatDialog, 
    private router: Router, 
    private notificationService: NotificacionService // Inyección del servicio de notificaciones
  ) { }

  ngOnInit() {
    this.verificar();
    this.loginService.user$.subscribe(user => this.user = user);
    this.getUserDetails();
    this.getUnreadCount(); // Obtener el conteo de notificaciones no leídas al inicializar
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

  // Método para marcar todas las notificaciones como leídas
  markAllNotificationsAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.unreadCount = 0; // Actualiza el contador en la UI a 0
    });
  }

  preventClose(event: MouseEvent) {
    event.stopPropagation();
  }
}
