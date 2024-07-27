import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from 'src/app/model/notification';
import { AdministracionService } from 'src/app/service/administracion.service';

@Component({
  selector: 'app-notification-admin',
  templateUrl: './notification-admin.component.html',
  styleUrls: ['./notification-admin.component.css']
})
export class NotificationAdminComponent implements OnInit{
  notifications: Notification[] = [];
  selectedUserId: number | null = null;
  userNotifications: Notification[] = [];

  constructor(private administracionService: AdministracionService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllNotifications();
  }

  loadAllNotifications(): void {
    this.administracionService.getAllNotifications().subscribe(data => {
      this.notifications = data;
    });
  }

  loadNotificationsByUserId(): void {
    if (this.selectedUserId !== null) {
      this.administracionService.getNotificationsByUserId(this.selectedUserId).subscribe(data => {
        this.userNotifications = data;
      });
    }
  }

  deleteNotification(id: number): void {
    this.administracionService.deleteNotification(id).subscribe(() => {
      this.loadAllNotifications();
      this.loadNotificationsByUserId();
    });
  }

  deleteAllNotifications(): void {
    this.administracionService.deleteAllNotifications().subscribe(() => {
      this.loadAllNotifications();
      this.userNotifications = [];
    });
  }
  volver(): void {
    this.router.navigate(['/components/users']);
  }
}
