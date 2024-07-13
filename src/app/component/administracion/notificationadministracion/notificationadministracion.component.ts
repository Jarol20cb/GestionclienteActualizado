import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notificationadministracion',
  templateUrl: './notificationadministracion.component.html',
  styleUrls: ['./notificationadministracion.component.css']
})
export class NotificationAdministracionComponent {
  @Input() message: string = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
