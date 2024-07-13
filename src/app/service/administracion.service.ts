import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/User';
import { tap } from 'rxjs/operators';

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
      tap(() => this.refrescarLista())
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

  // Metodo para iniciar el sondeo
  public startPolling(interval: number = 1000): void {
    setInterval(() => {
      this.refrescarLista();
    }, interval);
  }
}
