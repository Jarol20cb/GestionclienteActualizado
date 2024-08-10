import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MensajesPersonalizados } from '../model/MensajesPersonalizados';
import { catchError, Subject, throwError } from 'rxjs';

const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class MensajespersonalizadosService {
  private url = `${base_url}/mensajes`;
  private listaCambio = new Subject<MensajesPersonalizados[]>();

  constructor(private http: HttpClient) {}

  list() {
    let token = sessionStorage.getItem('token');
    return this.http.get<MensajesPersonalizados[]>(this.url, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }

  insert(proveedor: MensajesPersonalizados) {
    let token = sessionStorage.getItem('token');
    return this.http.post(this.url, proveedor, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }

  update(proveedor: MensajesPersonalizados) {
    let token = sessionStorage.getItem('token');
    return this.http.put(this.url, proveedor, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }

  delete(id: number) {
    let token = sessionStorage.getItem('token');
    return this.http.delete(`${this.url}/${id}`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 409 || error.status === 500) {
        errorMessage = 'No se puede borrar: está vinculado a otros registros.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }

  setList(listaNueva: MensajesPersonalizados[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    let token = sessionStorage.getItem('token');
    return this.http.get<MensajesPersonalizados>(`${this.url}/${id}`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }
}
