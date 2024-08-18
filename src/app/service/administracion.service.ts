// administracion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, timer, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from 'src/app/model/notification';
import { User } from '../model/User';
import { switchMap, tap } from 'rxjs/operators';
import { Message } from '../model/Message';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  private url = `${base_url}/admin/users`;
  private notificationUrl = `${base_url}/admin/notifications`;
  private listaCambio = new BehaviorSubject<User[]>([]);
  private listaCambioNotificacion = new Subject<Notification[]>();
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    })
  };

  constructor(private http: HttpClient) {
    this.refrescarLista();
    this.startPolling();
  }

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.url, this.httpOptions).pipe(
      tap(data => this.listaCambio.next(data))
    );
  }

  insert(user: User): Observable<User> {
    return this.http.post<User>(this.url, user, this.httpOptions).pipe(
      tap(() => this.refrescarLista())
    );
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}`, user, this.httpOptions).pipe(
      tap(updatedUser => {
        const users = this.listaCambio.getValue();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
          users[index] = updatedUser;
          this.listaCambio.next(users);
        }
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, this.httpOptions).pipe(
      tap(() => this.refrescarLista())
    );
  }

  enable(id: number): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}/enable`, null, this.httpOptions).pipe(
      tap(() => this.refrescarLista())
    );
  }

  disable(id: number): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}/disable`, null, this.httpOptions).pipe(
      tap(() => this.refrescarLista())
    );
  }

  getList(): Observable<User[]> {
    return this.listaCambio.asObservable();
  }

  refrescarLista(): void {
    this.list().subscribe();
  }

  startPolling(interval: number = 1000): void {
    timer(0, interval).pipe(
      switchMap(() => this.list())
    ).subscribe();
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`, this.httpOptions);
  }

  sendNotification(message: string, userIds: number[]): Observable<any> {
    return this.http.post(`${this.notificationUrl}/send`, { message, userIds }, this.httpOptions);
  }

  sendNotificationToAll(message: string): Observable<any> {
    return this.http.post(`${this.notificationUrl}/sendToAll`, { message }, this.httpOptions);
  }

  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.notificationUrl, this.httpOptions);
  }

  getNotificationsByUserId(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.url}/${userId}/notifications`, this.httpOptions);
  }

  deleteNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(`${this.notificationUrl}/${notificationId}`, this.httpOptions);
  }

  deleteAllNotifications(): Observable<void> {
    return this.http.delete<void>(this.notificationUrl, this.httpOptions);
  }

  setListNotificacion(listaNueva: Notification[]) {
    this.listaCambioNotificacion.next(listaNueva);
  }

  getListNotificacion() {
    return this.listaCambioNotificacion.asObservable();
  }

   // Método para listar todos los pagos pendientes
   listarPagosPendientes(): Observable<Message[]> {
    let token = sessionStorage.getItem('token');
    return this.http.get<Message[]>(`${base_url}/admin/pagos-pendientes`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  // Método para aceptar un pago
aceptarPago(id: number): Observable<string> {
  let token = sessionStorage.getItem('token');
  return this.http.put(`${base_url}/admin/pagos/${id}/aceptar`, null, {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json'),
    responseType: 'text'  // Aquí especificas que la respuesta es de tipo texto
  });
}

// Método para rechazar un pago
rechazarPago(id: number): Observable<string> {
  let token = sessionStorage.getItem('token');
  return this.http.put(`${base_url}/admin/pagos/${id}/rechazar`, null, {
    headers: new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json'),
    responseType: 'text'  // Aquí también especificas que la respuesta es de tipo texto
  });
}

}
