import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';
import { ConfirmDialogComponent } from 'src/app/component/dialogo/confirm-dialog-component/confirm-dialog-component.component';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  customer: CustomersServices | undefined;
  selectedMessageId: number = 0; // ID del mensaje seleccionado
  selectedMessage: string = ''; // Mensaje seleccionado
  availableMessages: { id: number, label: string }[] = []; // Lista de mensajes disponibles

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cS: CustomerserviceService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const customerId = +this.route.snapshot.paramMap.get('id')!;
    this.cS.list().subscribe((data) => {
      this.customer = data.find(c => c.idcs === customerId);
      if (this.customer) {
        this.setupAvailableMessages();
      }
    });
  }

  eliminarCliente(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cS.delete(id).subscribe(() => {
          console.log(`Cliente con id: ${id} eliminado`);
          this.router.navigate(['/components/customer-overview']);
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/components/customer-overview']);
  }

  editarClienteServicio(id: number) {
    if (id) {
      this.router.navigate(['/components/customeredit', id]);
    } else {
      console.error('ID del cliente no disponible para la edición.');
    }
  }

  getWhatsAppUrl(number: string): string {
    return `https://wa.me/${number}?text=${encodeURIComponent(this.selectedMessage)}`;
  }

  setupAvailableMessages(): void {
    this.availableMessages = [
      { id: 1, label: 'Mensaje de agradecimiento' },
      { id: 2, label: 'Mensaje de recordatorio' },
      { id: 3, label: 'Mensaje de bienvenida' },
      
    ];
  }

  selectMessage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const messageId = Number(target.value);
    this.selectedMessageId = messageId;
    this.selectedMessage = this.generateMessage(messageId);
  }

  cancelMessage(): void {
    this.selectedMessageId = 0;
    this.selectedMessage = '';
  }

  generateMessage(messageId: number): string {
    if (!this.customer) return '';

    const { correo, contrasena } = this.customer.perfil;
    const fechafin = new Date(this.customer.fechafin).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    const service = this.customer.services.service;

    switch (messageId) {
      case 1:
        return `Gracias por confiar en Nosotros.\n\nTu cuenta de ${service} es:\n\n📧 CORREO: ${correo}\n🔒CONTRASEÑA: ${contrasena}\n\n🔜  Fecha de renovación:  ${fechafin}\n\n⚠ Recuerda, no compartir tu cuenta con alguien más. Disfruta de tus series y películas 🍿🎬`;
      case 2:
        return `Hola, este es un recordatorio de tu servicio de ${service}.\n\n📧 CORREO: ${correo}\n🔒CONTRASEÑA: ${contrasena}\n\nFecha de renovación: ${fechafin}\n\n¡Disfruta tu servicio!`;
      case 3:
        return `Bienvenido a ${service}.\n\n📧 CORREO: ${correo}\n🔒CONTRASEÑA: ${contrasena}\n\nFecha de renovación: ${fechafin}\n\nEsperamos que disfrutes tu experiencia con nosotros.`;
      default:
        return '';
    }
  }
}
