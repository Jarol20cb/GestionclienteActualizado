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

  // list() {
  //   let token = sessionStorage.getItem('token');
  //   return this.http.get<Message[]>(this.url, {
  //     headers: new HttpHeaders()
  //       .set('Authorization', `Bearer ${token}`)
  //       .set('Content-Type', 'application/json'),
  //   });
  // }
  

  // Obtener todos los mensajes (solo para administradores)
  getAllMessages(): Observable<Message[]> {
    let token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Message[]>(`${this.url}/all`, { headers });
  }

  // Obtener mensajes del usuario autenticado
  getUserMessages(): Observable<Message[]> {
    let token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Message[]>(this.url, { headers });
  }

  // Eliminar un mensaje (solo para administradores)
  deleteMessage(id: number): Observable<void> {
    let token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.url}/${id}`, { headers });
  }

}
