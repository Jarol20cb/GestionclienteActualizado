import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/User';
import { tap, switchMap } from 'rxjs/operators';
import { timer } from 'rxjs';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  private url = `${base_url}/admin/users`;
  private listaCambio = new BehaviorSubject<User[]>([]);
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
        // Actualizar la lista de usuarios con los datos del usuario actualizado
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

  public refrescarLista(): void {
    this.list().subscribe();
  }

  // Método para iniciar el sondeo
  public startPolling(interval: number = 1000): void {
    timer(0, interval).pipe(
      switchMap(() => this.list())
    ).subscribe();
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`, this.httpOptions);
  }
  
}
