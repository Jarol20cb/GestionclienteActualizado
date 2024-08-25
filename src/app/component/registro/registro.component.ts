import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RegistroService } from 'src/app/service/registro.service';
import { DialogComponent } from '../dialogo/dialog/dialog.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  currentStep: number = 1;
  loading: boolean = false; // Variable para manejar el estado de carga

  constructor(
    private formBuilder: FormBuilder,
    private cS: RegistroService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      companyName: ['', Validators.required],
      number: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      accountType: ['']  // Este campo es opcional hasta el segundo paso
    });
  }

  goToStep2() {
    // Trigger validation on all controls in the form group for the first step
    this.form.get('username')?.markAsTouched();
    this.form.get('password')?.markAsTouched();
    this.form.get('confirmPassword')?.markAsTouched();
    this.form.get('name')?.markAsTouched();
    this.form.get('companyName')?.markAsTouched();
    this.form.get('number')?.markAsTouched();

    // Check if the first step is valid
    if (this.form.get('username')?.valid &&
        this.form.get('password')?.valid &&
        this.form.get('confirmPassword')?.valid &&
        this.form.get('name')?.valid &&
        this.form.get('number')?.valid &&
        this.form.get('companyName')?.valid) {
      this.currentStep = 2;
    } else {
      this.openDialog('Formulario no válido', 'Por favor, completa todos los campos del primer paso.');
    }
  }

  goToStep1() {
    this.currentStep = 1;
  }

  registrar() {
    if (this.form.valid) {
      this.loading = true; // Mostrar spinner de carga

      const registro = {
        id: 0,
        username: this.form.value.username,
        password: this.form.value.password,
        roles: ['USER'],
        name: this.form.value.name,
        companyName: this.form.value.companyName,
        accountType: this.form.value.accountType,
        number: this.form.value.number
      };

      this.cS.insert(registro).subscribe(
        (data) => {
          this.loading = false; // Ocultar spinner de carga
          console.log('Registro exitoso:', data.message);
          this.router.navigate(['login']);
          this.openDialog('Registro Exitoso', data.message);
        },
        (error) => {
          this.loading = false; // Ocultar spinner de carga incluso en caso de error
          console.error('Error en el registro:', error);
          this.openDialog('Error', 'Error en el registro: ' + (error.error.message || error.message || 'Error desconocido.'));
        }
      );
    } else {
      this.openDialog('Formulario no válido', 'Por favor, completa todos los campos.');
    }
  }

  openDialog(title: string, message: string): void {
    let imageUrl: string;

    if (title === 'Registro Exitoso') {
      imageUrl = 'assets/exito.png';
    } else if (title === 'Error') {
      imageUrl = 'assets/koala-mareado.png';
    } else {
      imageUrl = 'assets/error.png';
    }

    this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title, message, imageUrl },
    });
  }

  cancel() {
    this.router.navigate(['/login']);
  }
}
