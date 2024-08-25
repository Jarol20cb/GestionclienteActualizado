import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialogo/dialog/dialog.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  message: string | null = null;
  errorMessage: string | null = null;
  email: string | null = null;
  code: string | null = null;
  hidePassword = true;
  passwordMismatch = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.resetForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  cancel() {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      if (!this.email) {
        this.errorMessage = 'Correo electrónico inválido o faltante.';
      }
    });

    this.resetForm.valueChanges.subscribe(() => {
      this.passwordMismatch = this.resetForm.get('newPassword')?.value !== this.resetForm.get('confirmPassword')?.value;
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  verifyCode(): void {
    if (this.email && this.resetForm.get('code')?.valid) {
      this.authService.verifyResetCode(this.email, this.resetForm.value.code)
        .subscribe({
          next: response => {
            this.message = 'Código verificado correctamente. Ahora puedes restablecer tu contraseña.';
            this.errorMessage = null;
          },
          error: error => {
            this.errorMessage = 'Código inválido o expirado.';
            this.message = null;
          }
        });
    } else {
      this.errorMessage = 'Formulario inválido o faltante correo.';
    }
  }

  onSubmit(): void {
    if (this.resetForm.valid && this.email && !this.passwordMismatch) {
      this.authService.resetPassword(this.email, this.resetForm.value.code, this.resetForm.value.newPassword)
        .subscribe({
          next: response => {
            this.message = 'Contraseña restablecida exitosamente.';
            this.errorMessage = null;
            this.openDialog('Restablecimiento exitoso', this.message);
            this.router.navigate(['/login']);
          },
          error: error => {
            this.errorMessage = 'Hubo un error al restablecer la contraseña. Intenta nuevamente.';
            this.openDialog('Error', 'Error en el restablecimiento: ' + (error.error.message || error.message || 'Error desconocido.'));
            this.message = null;
          }
        });
    } else {
      this.errorMessage = 'Formulario inválido o faltante correo.';
    }
  }

  openDialog(title: string, message: string): void {
    const images: { [key: string]: string } = {
      'Correo enviado': 'assets/exito.png',
      'Restablecimiento exitoso': 'assets/exito.png',
      'Error': 'assets/koala-mareado.png'
    };

    const imageUrl = images[title] || 'assets/error.png';

    this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title, message, imageUrl },
    });
  }
}
