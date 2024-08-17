import { Component } from '@angular/core';
import { Message } from 'src/app/model/Message';
import { UserData } from 'src/app/model/userdata';
import { LoginService } from 'src/app/service/login.service';
import { MessageService } from 'src/app/service/message-service.service';

@Component({
  selector: 'app-realizarpago',
  templateUrl: './realizarpago.component.html',
  styleUrls: ['./realizarpago.component.css']
})
export class RealizarPagoComponent {
  user: UserData | null = null;
  fileToUpload: File | null = null;
  title: string = '';

  constructor(
    private messageService: MessageService,
    private loginService: LoginService
  ) {
    this.loginService.getUserDetails().subscribe(user => {
      this.user = user;
    });
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileToUpload = input.files[0];
    }
  }  

  submitPayment() {
    if (this.fileToUpload && this.user) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
  
        const message = new Message({
          userId: this.user!.id, // Usamos '!' para asegurar que no es null
          title: this.title,
          fileData: base64Data.split(',')[1],  // Extraemos solo la parte base64
          createdAt: new Date(),
        });
  
        this.messageService.insert(message).subscribe(response => {
          console.log('Comprobante subido exitosamente:', response);
          // Aquí podrías agregar una notificación o limpiar el formulario
        }, error => {
          console.error('Error al subir el comprobante:', error);
        });
      };
      reader.readAsDataURL(this.fileToUpload);
    } else {
      console.error('No se puede subir el comprobante porque el usuario o el archivo no están definidos.');
    }
  }
  
  
}