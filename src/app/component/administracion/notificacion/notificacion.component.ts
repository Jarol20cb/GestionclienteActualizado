import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificacionService } from 'src/app/service/notificacion.service';
import { Notification } from 'src/app/model/notification';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.getNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
      },
      (error) => {
        console.error('Error al obtener las notificaciones', error);
      }
    );
  }
}