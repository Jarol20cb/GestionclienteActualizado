import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = `${base_url}/admin`;
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.url}/users`);
  }

  getUsersPeriodically(): Observable<any> {
    return timer(0, 5000).pipe( 
      switchMap(() => this.getUsers())
    );
  }
}
