import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { DialogComponent } from '../../dialogo/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    private router: Router,
    private dialog: MatDialog
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  cancel() {
    this.router.navigate(['/login']);
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
            this.openDialog('Restablecimiento exitoso', this.message); // Ajusta el título
            this.router.navigate(['/login']);
          },
          error: error => {
            console.error('Error en el restablecimiento:', error);
            this.errorMessage = 'Hubo un error al restablecer la contraseña. Intenta nuevamente.';
            this.openDialog('Error', 'Error en el registro: ' + (error.error.message || error.message || 'Error desconocido.'));
            this.message = null;
          }
        });
    } else {
      this.errorMessage = 'Formulario inválido o faltante token.';
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
