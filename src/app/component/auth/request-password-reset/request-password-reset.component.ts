import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/auth.service';
import { DialogComponent } from '../../dialogo/dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.css']
})
export class RequestPasswordResetComponent {
  requestForm: FormGroup;
  message: string | null = null;
  errorMessage: string | null = null;
  isSubmitting: boolean = false; // Nueva variable para controlar el estado de envío

  constructor(private fb: FormBuilder, private authService: AuthService, private dialog: MatDialog, private router: Router) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid && !this.isSubmitting) {
      this.isSubmitting = true; // Deshabilita el botón
      this.authService.requestPasswordReset(this.requestForm.value.email)
        .subscribe({
          next: response => {
            this.message = 'El correo para restablecer la contraseña ha sido enviado.';
            this.openDialog('Correo enviado', this.message);
            this.errorMessage = null;
            this.isSubmitting = false;
            this.router.navigate(['/reset-password'], { queryParams: { email: this.requestForm.value.email } });
          },
          error: error => {
            this.errorMessage = 'El correo electrónico no existe.';
            this.openDialog('Error', 'Error ' + (error.error.message || error.message || 'Error desconocido.'));
            this.message = null;
            this.isSubmitting = false;
          }
        });
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

  cancel() {
    this.router.navigate(['/login']);
  }
}
