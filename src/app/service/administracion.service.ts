import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/User';
import { switchMap, tap } from 'rxjs/operators';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  private url = `${base_url}/admin/users`;
  private listaCambio = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {}

  private getHeaders() {
    let token = sessionStorage.getItem('token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  list() {
    return this.http.get<User[]>(this.url, {
      headers: this.getHeaders(),
    }).pipe(
      tap(users => this.listaCambio.next(users)) // Emitimos la nueva lista
    );
  }

  insert(user: User) {
    return this.http.post(this.url, user, {
      headers: this.getHeaders(),
    }).pipe(
      switchMap(() => this.list())
    );
  }

  setList(listaNueva: User[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.url}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  update(id: number, user: User) {
    return this.http.put(`${this.url}/${id}`, user, {
      headers: this.getHeaders(),
    }).pipe(
      switchMap(() => this.list())
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      headers: this.getHeaders(),
    }).pipe(
      switchMap(() => this.list())
    );
  }

  enable(id: number) {
    return this.http.put(`${this.url}/${id}/enable`, null, {
      headers: this.getHeaders(),
    }).pipe(
      switchMap(() => this.list())
    );
  }

  disable(id: number) {
    return this.http.put(`${this.url}/${id}/disable`, null, {
      headers: this.getHeaders(),
    }).pipe(
      switchMap(() => this.list())
    );
  }
}
