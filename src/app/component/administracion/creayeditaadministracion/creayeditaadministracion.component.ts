import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { User, Role } from 'src/app/model/User';

@Component({
  selector: 'app-creayeditaadministracion',
  templateUrl: './creayeditaadministracion.component.html',
  styleUrls: ['./creayeditaadministracion.component.css']
})
export class CreayeditaadministracionComponent implements OnChanges {
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  showPassword = false;
  availableRoles: string[] = ['ADMIN', 'USER'];
  selectedRole: string = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      if (this.user.roles.length > 0) {
        this.selectedRole = this.user.roles[0].rol;
      }
    }
  }

  onSave() {
    if (this.user) {
      this.user.roles = [{
        id: 0,
        rol: this.selectedRole,
        userId: this.user!.id
      }] as Role[];
      this.save.emit(this.user);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}