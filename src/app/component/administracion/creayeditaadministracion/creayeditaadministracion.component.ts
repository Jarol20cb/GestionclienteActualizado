import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-creayeditaadministracion',
  templateUrl: './creayeditaadministracion.component.html',
  styleUrls: ['./creayeditaadministracion.component.css']
})
export class CreayeditaadministracionComponent {
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSave() {
    if (this.user) {
      this.save.emit(this.user);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
