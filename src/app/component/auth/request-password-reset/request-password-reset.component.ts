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

  constructor(private fb: FormBuilder, private authService: AuthService, private dialog: MatDialog, private router: Router) {
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
            this.openDialog('Correo enviado', this.message); // Ajusta el título
            this.errorMessage = null;
          },
          error: error => {
            this.errorMessage = 'El correo electronico no existe.';
            this.openDialog('Error', 'Error ' + (error.error.message || error.message || 'Error desconocido.'));
            this.message = null;
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
