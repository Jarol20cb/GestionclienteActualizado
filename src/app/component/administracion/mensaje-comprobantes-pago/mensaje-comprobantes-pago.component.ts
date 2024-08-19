import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/model/Message';
import { AdministracionService } from 'src/app/service/administracion.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mensaje-comprobantes-pago',
  templateUrl: './mensaje-comprobantes-pago.component.html',
  styleUrls: ['./mensaje-comprobantes-pago.component.css']
})
export class MensajeComprobantesPagoComponent implements OnInit {
  mensajes: Message[] = [];
  isModalOpen = false;
  modalImageSrc: string | null = null;

  constructor(private administracionService: AdministracionService, private location: Location) {}

  ngOnInit(): void {
    this.listarPagosPendientes();
  }

  listarPagosPendientes(): void {
    this.administracionService.listarPagosPendientes().subscribe((data: Message[]) => {
      this.mensajes = data.filter(m => m.status === 'PENDING').sort((a, b) => b.id - a.id); // Filtrar solo los pendientes
    });
  }

  getBase64Image(base64: string): string {
    if (base64) {
      if (base64.startsWith('data:image/')) {
        return base64;
      }
      return 'data:image/jpeg;base64,' + base64;
    }
    return '';
  }

  openModal(imageSrc: string): void {
    this.isModalOpen = true;
    this.modalImageSrc = imageSrc;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.modalImageSrc = null;
  }

  aceptarPago(id: number): void {
    this.administracionService.aceptarPago(id).subscribe(response => {
      console.log('Pago aceptado:', response);
      this.listarPagosPendientes();  // Refresca la lista después de aceptar el pago
    });
  }

  rechazarPago(id: number): void {
    this.administracionService.rechazarPago(id).subscribe(response => {
      console.log('Pago rechazado:', response);
      this.listarPagosPendientes();  // Refresca la lista después de rechazar el pago
    });
  }

  goBack(): void {
    this.location.back();
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ACCEPTED':
        return 'Aceptado';
      case 'REJECTED':
        return 'Rechazado';
      case 'PENDING':
        return 'Pendiente';
      default:
        return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACCEPTED':
        return 'green';
      case 'REJECTED':
        return 'red';
      case 'PENDING':
        return 'orange';
      default:
        return 'black';
    }
  }
}
