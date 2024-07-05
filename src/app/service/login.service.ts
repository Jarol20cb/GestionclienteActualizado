import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtRequest } from '../model/jwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Observable, from } from 'rxjs';
import { Registro } from '../model/registro';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.base;

  constructor(private http: HttpClient) { }

  login(request: JwtRequest) {
    return this.http.post(`${this.baseUrl}/authenticate`, request);
  }

  verificar() {
    let token = sessionStorage.getItem("token");
    return token != null;
  }

  showRole() {
    let token = sessionStorage.getItem("token");
    if (!token) {
      return null;
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.role;
  }

  showUser() {
    let token = sessionStorage.getItem("token");
    if (!token) {
      return null;
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.sub;
  }

  showName() {
    let token = sessionStorage.getItem("token");
    if (!token) {
      return null;
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.name;
  }

  getUserDetails(): Observable<Registro> {
    let token = sessionStorage.getItem("token");
    if (token) {
      return this.http.get<Registro>(`${this.baseUrl}/user/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      return from(Promise.reject('No token found'));
    }
  }
}
