import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Message } from 'src/app/model/Message';
import { MessageService } from 'src/app/service/message-service.service';

@Component({
  selector: 'app-listarcomprobantes',
  templateUrl: './listarcomprobantes.component.html',
  styleUrls: ['./listarcomprobantes.component.css']
})
export class ListarcomprobantesComponent implements OnInit {
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  isModalOpen = false;
  modalImageSrc: string | null = null;
  filterTitle: string = '';
  filterDate: string = '';

  constructor(private messageService: MessageService, private location: Location) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  private loadMessages(): void {
    this.messageService.getUserMessages().subscribe((data: Message[]) => {
      this.messages = data.sort((a, b) => b.id - a.id);
      this.filteredMessages = [...this.messages];
    });
  }

  applyFilters(): void {
    this.filteredMessages = [...this.messages];

    if (this.filterDate) {
      const selectedDate = new Date(this.filterDate);
      this.filteredMessages = this.filteredMessages.filter(message => {
        const messageDate = new Date(message.createdAt);
        return (
          messageDate.getDate() === selectedDate.getDate() &&
          messageDate.getMonth() === selectedDate.getMonth() &&
          messageDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }

    if (this.filterTitle) {
      this.filteredMessages = this.filteredMessages.filter(message =>
        message.title.toLowerCase().includes(this.filterTitle.toLowerCase())
      );
    }
  }

  clearFilters(): void {
    this.filterTitle = '';
    this.filterDate = '';
    this.filteredMessages = [...this.messages];
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
