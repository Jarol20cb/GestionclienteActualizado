import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.css']
})
export class RequestPasswordResetComponent {
  requestForm: FormGroup;
  message: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.authService.requestPasswordReset(this.requestForm.value.email)
        .subscribe({
          next: response => {
            this.message = 'El correo para restablecer la contraseña ha sido enviado.';
            this.errorMessage = null;
          },
          error: error => {
            this.errorMessage = 'Hubo un error al enviar el correo. Intenta nuevamente.';
            this.message = null;
          }
        });
    }
  }
}
