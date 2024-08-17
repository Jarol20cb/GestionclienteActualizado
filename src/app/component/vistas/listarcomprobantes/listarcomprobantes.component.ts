import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Message } from 'src/app/model/Message';
import { MessageService } from 'src/app/service/message-service.service';

@Component({
  selector: 'app-listarcomprobantes',
  templateUrl: './listarcomprobantes.component.html',
  styleUrls: ['./listarcomprobantes.component.css']
})
export class ListarcomprobantesComponent implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.getUserMessages().subscribe((data: Message[]) => {
        this.messages = data;
        this.messages.forEach(message => {
            if (message.fileData) {
                message.fileData = this.getBase64Image(message.fileData);
            }
        });
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
}
