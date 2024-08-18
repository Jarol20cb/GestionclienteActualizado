import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../model/Message';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private url = `${base_url}/messages`;

  constructor(private http: HttpClient) { }

  insert(message: any) {
    let token = sessionStorage.getItem('token');
    return this.http.post(this.url, message, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  getUserMessages() {
    let token = sessionStorage.getItem('token');
    return this.http.get<Message[]>(this.url, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }

  // Eliminar un mensaje (solo para administradores)
  deleteMessage(id: number): Observable<void> {
    let token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.url}/${id}`, { headers });
  }

}
