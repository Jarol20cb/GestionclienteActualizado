import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  message: string | null = null;
  errorMessage: string | null = null;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.errorMessage = 'Token inválido o faltante.';
      } else {
        console.log('Token capturado:', this.token); // Verifica que el token se capture correctamente
      }
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid && this.token) {
      this.authService.resetPassword(this.token, this.resetForm.value.newPassword)
        .subscribe({
          next: response => {
            console.log('Respuesta del backend:', response);
            this.message = 'Contraseña restablecida exitosamente.';
            this.errorMessage = null;
            this.router.navigate(['/login']);  // Redirige al login después de restablecer la contraseña
          },
          error: error => {
            console.error('Error en el restablecimiento:', error);
            this.errorMessage = 'Hubo un error al restablecer la contraseña. Intenta nuevamente.';
            this.message = null;
          }
        });
    } else {
      this.errorMessage = 'Formulario inválido o faltante token.';
    }
  }
}
