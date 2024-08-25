import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.base;  // URL base del backend

  constructor(private http: HttpClient) { }

  // Método para solicitar restablecimiento de contraseña
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/request-password-reset`, { email }, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en requestPasswordReset:', error);
        return throwError(() => new Error('Error al solicitar el restablecimiento de contraseña.'));
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    console.log('Enviando solicitud al backend con token y nueva contraseña:', token, newPassword);
    return this.http.post(`${this.baseUrl}/reset-password?token=${token}`, { newPassword }, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en resetPassword:', error);
        return throwError(() => new Error('Error al restablecer la contraseña.'));
      })
    );
  }  
}
