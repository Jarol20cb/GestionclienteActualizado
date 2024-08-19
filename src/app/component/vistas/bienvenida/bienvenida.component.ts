import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent {
  currentStep = 0;
  steps = [
    {
      title: 'Bienvenido',
      content: 'Bienvenido a Rentala, la herramienta que te ayudara a tener un mejor control de tus clientes de streaming',
      image: 'assets/bienvenida/saludo.gif'
    },
    {
      title: 'Gestión a tus socios y proveedores',
      content: 'Administra tus proveedores y socios desde un único lugar. Añade nuevos proveedores y socios fácilmente para mantener tu red actualizada.',
      image: 'assets/bienvenida/personas-usuarios.png'
    },
    {
      title: 'Servicios y Perfiles',
      content: 'Registra y gestiona los servicios que ofreces, así como los perfiles obtenidos de diferentes proveedores.',
      image: 'assets/bienvenida/servicios.gif'
    },
    {
      title: 'Clientes',
      content: 'Registra a tus clientes, asigna perfiles y servicios, y gestiona la relación con ellos de manera centralizada.',
      image: 'assets/bienvenida/cliente.gif'
    },
    {
      title: 'Recomendaciones',
      content: 'Para un uso óptimo, sigue el flujo recomendado: gestiona primero los proveedores y socios, luego los servicios, perfiles y finalmente los clientes.',
      image: 'assets/bienvenida/koala.png'
    }
  ];

  constructor(private router: Router, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<BienvenidaComponent>) {}

  onClose() {
    const canClose = this.data?.allowClose ?? true; // Si `allowClose` es undefined, se usa `true` como valor por defecto
    if (canClose) {
      this.dialogRef.close(); // Cierra el banner si se permite cerrarlo
    }
  }
  

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    } else {
      this.router.navigate(['/components/home']);
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  acceptAndFinish() {
    this.router.navigate(['/ruta_final']); // Redirige a la página deseada al finalizar
  }

  skipToEnd() {
    this.currentStep = this.steps.length - 1;
  }
}
