import { Injectable } from '@angular/core';
import { Registro } from '../model/registro';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const base_url = environment.base

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private url = `${base_url}/register`
  constructor(private http: HttpClient) { }
  insert(cl: Registro) {
    return this.http.post<{ message: string }>(this.url, cl);
  }
  

}
