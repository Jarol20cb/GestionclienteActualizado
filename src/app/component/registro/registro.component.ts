import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Registro } from 'src/app/model/registro';
import { RegistroService } from 'src/app/service/registro.service';
import { DialogComponent } from '../dialogo/dialog/dialog.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  registro: Registro = new Registro();
  id: number = 0;
  passwordVisible: boolean = false;

  constructor(
    private cS: RegistroService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
    });

    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]], // Validación de correo electrónico
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      companyName: ['', Validators.required],
    });
  }

  registrar() {
    if (this.form.valid) {
      const registro: Registro = {
        id: this.form.value.id,
        username: this.form.value.username,
        password: this.form.value.password,
        roles: ['USER'], // Asignar el rol USER por defecto
        name: this.form.value.name,
        companyName: this.form.value.companyName,
      };
  
      this.cS.insert(registro).subscribe(
        (data) => {
          console.log('Registro exitoso:', data.message);
          this.router.navigate(['login']);
          this.openDialog('Registro Exitoso', data.message);
        },
        (error) => {
          console.error('Error en el registro:', error);
          this.openDialog('Error', 'Error en el registro: ' + (error.error.message || error.message || 'Error desconocido.'));
        }
      );
    } else {
      this.openDialog('Formulario no válido', 'Por favor, completa todos los campos.');
    }
  }

  openDialog(title: string, message: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title, message },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El cuadro de diálogo se cerró');
    });
  }

  togglePasswordVisibility(event: Event) {
    event.preventDefault(); // Evitar que el formulario se envíe al hacer clic en el botón
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = this.form.get('password');
    if (passwordInput) {
      passwordInput.setValidators(this.passwordVisible ? null : [Validators.minLength(5)]);
      passwordInput.updateValueAndValidity();
    }
  }

  validatePasswordConfirmation() {
    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      this.form.get('confirmPassword')?.setErrors(null);
    } else {
      this.form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
  }
}
