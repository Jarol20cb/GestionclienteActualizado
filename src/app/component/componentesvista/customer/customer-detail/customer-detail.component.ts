import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';
import { ConfirmDialogComponent } from 'src/app/component/dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { MensajespersonalizadosService } from 'src/app/service/mensajespersonalizados.service';
import { Location } from '@angular/common';
import { ConfirmarRenovacionDialogComponent } from 'src/app/component/confirmar-renovacion-dialog/confirmar-renovacion-dialog.component';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  customer: CustomersServices | undefined;
  selectedMessageId: number = 0;
  selectedMessage: string = '';
  availableMessages: { id: number, label: string, type: 'predetermined' | 'custom' }[] = [];
  customers: CustomersServices[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cS: CustomerserviceService,
    private mensajesService: MensajespersonalizadosService,
    public dialog: MatDialog,
    private location: Location
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
          this.router.navigate(['/components/customer-overview']);
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
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
      { id: -1, label: 'Agradecimiento por tu Preferencia', type: 'predetermined' },
      { id: -2, label: 'Recordatorio de Renovación', type: 'predetermined' },
      { id: -3, label: '¡Bienvenido a Nuestro Servicio!', type: 'predetermined' },
      { id: -4, label: 'Aviso Importante: Vencimiento del Servicio', type: 'predetermined' }
    ];

    this.mensajesService.list().subscribe((mensajes) => {
      const customMessages = mensajes.map(msg => ({
        id: msg.id,
        label: msg.titulo, // Utilizar el título para el dropdown
        type: 'custom' as const
      }));
      this.availableMessages = this.availableMessages.concat(customMessages);
    });
  }

  selectMessage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const messageId = Number(target.value);
    const selectedMessage = this.availableMessages.find(msg => msg.id === messageId);

    if (selectedMessage?.type === 'predetermined') {
      this.selectedMessage = this.generateMessage(messageId);
    } else if (selectedMessage?.type === 'custom') {
      this.mensajesService.listId(messageId).subscribe(estructura => {
        this.selectedMessage = this.applyMessageStructure(estructura.message);
      });
    }
  }

  applyMessageStructure(template: string): string {
    if (!this.customer) return '';

    return template
      .replace(/{name}/g, this.customer.name)
      .replace(/{services}/g, this.customer.services.service)
      .replace(/{perfil}/g, this.customer.perfil.correo)
      .replace(/{contrasena}/g, this.customer.perfil.contrasena)
      .replace(/{fechainicio}/g, new Date(this.customer.fechainicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }))
      .replace(/{fechafin}/g, new Date(this.customer.fechafin).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }))
      .replace(/{estado}/g, this.customer.estado)
      .replace(/{socio}/g, this.customer.socio.name)
      .replace(/{numerocelular}/g, this.customer.numerocelular || '');
  }

  cancelMessage(): void {
    this.selectedMessageId = 0;
    this.selectedMessage = '';
  }

  copyMessage(): void {
    navigator.clipboard.writeText(this.selectedMessage).then(() => {
      alert('Mensaje copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar el mensaje: ', err);
    });
  }

  generateMessage(messageId: number): string {
    if (!this.customer) return '';

    const { correo, contrasena } = this.customer.perfil;
    const fechafin = new Date(this.customer.fechafin).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    const service = this.customer.services.service;
    const name = this.customer.name;

    switch (messageId) {
      case -1:
        return `Hola ${name},\n\nGracias por confiar en nosotros. Tu cuenta de ${service} está lista:\n\n📧 Correo: ${correo}\n🔒 Contraseña: ${contrasena}\n\n📅 Fecha de renovación: ${fechafin}\n\n¡Disfruta tu servicio!`;
      case -2:
        return `Hola ${name},\n\nTe recordamos que tu servicio de ${service} está próximo a renovarse el ${fechafin}. Si tienes alguna pregunta, estamos aquí para ayudarte.\n\n¡Gracias por estar con nosotros!`;
      case -3:
        return `¡Bienvenido/a, ${name}!\n\nTu cuenta de ${service} está lista para usarse. Aquí están tus detalles:\n\n📧 Correo: ${correo}\n🔒 Contraseña: ${contrasena}\n\n📅 Fecha de renovación: ${fechafin}\n\n¡Esperamos que disfrutes de nuestro servicio!`;
      case -4:
        return `👋 ¡Hola ${name}!\n\n🔔 Te recordamos que tu servicio de **${service}** vence el **${fechafin}**. Para evitar interrupciones en tu servicio, por favor realiza el pago antes de esa fecha. 🗓️\n\n💳 Si ya has realizado el pago, ¡muchas gracias! 🙏\n\n⚡ ¡No te quedes sin disfrutar de todos nuestros beneficios! 🌟`;
      default:
        return '';
    }
  }

  cambiarEstado(element: CustomersServices) {
    const dialogRef = this.dialog.open(ConfirmarRenovacionDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (element.estado === 'pendiente') {
          element.estado = 'cancelado';
          const startDate = new Date(element.fechafin);
          const endDate = new Date(startDate);
          startDate.setMonth(startDate.getMonth());
          endDate.setMonth(startDate.getMonth() + 1);

          element.fechainicio = startDate;
          element.fechafin = endDate;

          this.cS.update(element).subscribe(() => {
            this.cS.list().subscribe((data) => {
              this.customers = data;
            });
          });
        } else {
          alert('El estado no se puede cambiar porque ya está actualizado.');
        }
      }
    });
  }
}
