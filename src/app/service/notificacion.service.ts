import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from 'src/app/model/notification';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private url = `${base_url}/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(userId: number): Observable<Notification[]> {
    let token = sessionStorage.getItem('token');
    return this.http.get<Notification[]>(`${this.url}/user/${userId}`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }
}
