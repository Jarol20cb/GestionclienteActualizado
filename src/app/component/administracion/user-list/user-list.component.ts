import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/model/User';
import { AdministracionService } from 'src/app/service/administracion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  editingUser: User | null = null;
  private subscriptions: Subscription[] = [];

  showNotification: boolean = false;
  notificationMessage: string = '';
  actionToConfirm: () => void = () => {};

  constructor(private administracionService: AdministracionService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.administracionService.getList().subscribe(users => {
        this.users = users;
      })
    );
    this.administracionService.startPolling(1000); // Actualizar cada segundo
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleUserStatus(user: User): void {
    this.notificationMessage = user.enabled ? `¿Desactivar al usuario ${user.username}?` : `¿Activar al usuario ${user.username}?`;
    this.actionToConfirm = () => {
      const action = user.enabled ? this.administracionService.disable(user.id) : this.administracionService.enable(user.id);
      this.subscriptions.push(
        action.subscribe(() => {
          this.administracionService.refrescarLista();
          this.hideNotification();
        })
      );
    };
    this.showNotification = true;
  }

  deleteUser(id: number): void {
    this.notificationMessage = `¿Eliminar al usuario con ID ${id}?`;
    this.actionToConfirm = () => {
      this.subscriptions.push(
        this.administracionService.delete(id).subscribe(() => {
          this.administracionService.refrescarLista();
          this.hideNotification();
        })
      );
    };
    this.showNotification = true;
  }

  editUser(user: User): void {
    this.editingUser = { ...user };
  }

  updateUser(user: User): void {
    if (user) {
      this.subscriptions.push(
        this.administracionService.update(user.id, user).subscribe(() => {
          this.editingUser = null;
          this.administracionService.refrescarLista();
        })
      );
    }
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  getRoles(user: User): string {
    return user.roles ? user.roles.map(role => role.rol).join(', ') : 'No Roles';
  }

  hideNotification() {
    this.showNotification = false;
    this.notificationMessage = '';
    this.actionToConfirm = () => {};
  }

  confirmAction() {
    if (this.actionToConfirm) {
      this.actionToConfirm();
      this.hideNotification(); // Ocultar notificación después de confirmar la acción
    }
  }

  cancelAction() {
    this.hideNotification();
  }
}
