import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajespersonalizadosService } from 'src/app/service/mensajespersonalizados.service';

@Component({
  selector: 'app-mensajes-personalizados',
  templateUrl: './mensajes-personalizados.component.html',
  styleUrls: ['./mensajes-personalizados.component.css']
})
export class MensajesPersonalizadosComponent implements OnInit {
  mensajeForm: FormGroup;
  variablesDisponibles: string[] = [
    '{name}', 
    '{services}', 
    '{perfil}', 
    '{fechainicio}', 
    '{fechafin}', 
    '{estado}', 
    '{socio}', 
    '{numerocelular}'
  ];

  constructor(
    private fb: FormBuilder,
    private mensajesService: MensajespersonalizadosService
  ) {
    this.mensajeForm = this.fb.group({
      titulo: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.mensajeForm.valid) {
      const mensaje = this.mensajeForm.value;
      this.mensajesService.insert(mensaje).subscribe(
        response => {
          console.log('Mensaje guardado exitosamente');
          this.mensajeForm.reset();
        },
        error => {
          console.error('Error al guardar el mensaje', error);
        }
      );
    }
  }

  agregarVariable(variable: string) {
    const messageControl = this.mensajeForm.get('message');
    if (messageControl) {
      const actualMessage = messageControl.value || '';
      messageControl.setValue(actualMessage + ' ' + variable);
    }
  }
}
