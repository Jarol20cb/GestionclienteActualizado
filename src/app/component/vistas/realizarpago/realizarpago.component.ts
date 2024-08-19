import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Message } from 'src/app/model/Message';
import { UserData } from 'src/app/model/userdata';
import { LoginService } from 'src/app/service/login.service';
import { MessageService } from 'src/app/service/message-service.service';
import { BannerComponent } from '../banner/banner.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-realizarpago',
  templateUrl: './realizarpago.component.html',
  styleUrls: ['./realizarpago.component.css']
})
export class RealizarPagoComponent {
  user: UserData | null = null;
  fileToUpload: File | null = null;
  title: string = '';
  imageUrl: string | ArrayBuffer | null = null;

  selectedPaymentMethod: string = '';
  paymentImage: string = '';

  constructor(
    private messageService: MessageService,
    private loginService: LoginService,
    private router: Router,
    private dialog: MatDialog,
    private location: Location
  ) {
    this.loginService.getUserDetails().subscribe(user => {
      this.user = user;
    });
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileToUpload = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imageUrl = e.target!.result;
      };
      reader.readAsDataURL(this.fileToUpload);
    }
  }

  submitPayment() {
    if (this.fileToUpload && this.user) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;

        const message = new Message({
          title: this.title,
          fileData: base64Data.split(',')[1],
          createdAt: new Date(),
        });

        this.messageService.insert(message).subscribe(response => {
          console.log('Comprobante subido exitosamente:', response);
          this.fileToUpload = null;
          this.title = '';
          this.imageUrl = null;

          // Muestra el banner después de un pago exitoso
          this.showBanner();
        }, error => {
          console.error('Error al subir el comprobante:', error);
        });
      };
      reader.readAsDataURL(this.fileToUpload);
    } else {
      console.error('No se puede subir el comprobante porque el usuario o el archivo no están definidos.');
    }
  }

  showBanner() {
    const dialogRef = this.dialog.open(BannerComponent, {
      data: {
        image: 'assets/exito.png',
        title: '¡Pago Realizado Exitosamente!',
        message: [
          'Gracias por realizar su pago. Su cuenta se activará temporalmente mientras validamos su transacción.',
          'Agradecemos su confianza y esperamos que disfrute de todos los beneficios que hemos preparado para usted.',
          '¡NO OLVIDES VER TUS NOTIFICACIONES PARA REVISAR EL ESTADO DE TU PAGO!'
        ],
        buttons: [
          { text: 'Aceptar', class: 'realizar-pago', action: this.redirectWithAnimation.bind(this) }
        ],
        allowClose: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El banner ha sido cerrado');
    });
  }

  redirectWithAnimation() {
    const style = document.createElement('style');
    style.innerHTML = `
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
      }

      .spinner {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid #ecf0f1;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .dots::after {
        content: '...';
        display: inline-block;
        animation: dots 1.5s steps(3, end) infinite;
      }

      @keyframes dots {
        0%, 20% { content: ''; }
        40% { content: '.'; }
        60% { content: '..'; }
        80%, 100% { content: '...'; }
      }
    `;
    document.head.appendChild(style);

    const redirectElement = document.createElement('div');
    redirectElement.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
        <h2>Redirigiendo<span class="dots"></span></h2>
      </div>
    `;

    document.body.appendChild(redirectElement);

    setTimeout(() => {
      this.router.navigate(['/components/listar-pago']);
      document.body.removeChild(redirectElement);
      document.head.removeChild(style);  // Remover el estilo después de la redirección
    }, 3000); // Espera 3 segundos antes de redirigir
  }

  goBack(): void {
    this.location.back();
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    if (method === 'yape') {
      this.paymentImage = 'assets/qr/yape.jpg';
    } else if (method === 'plin') {
      this.paymentImage = 'assets/qr/izipay.png';
    }
  }
}
