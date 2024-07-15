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
  paginatedUsers: User[] = [];
  editingUser: User | null = null;
  private subscriptions: Subscription[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  showNotification: boolean = false;
  notificationMessage: string = '';
  actionToConfirm: () => void = () => {};

  constructor(private administracionService: AdministracionService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.administracionService.getList().subscribe(users => {
        this.users = users;
        this.sortUsersById();
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.updatePaginatedUsers();
      })
    );

    this.administracionService.startPolling();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  sortUsersById(): void {
    this.users.sort((a, b) => a.id - b.id);
  }

  filterUsers(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value;
    const filteredUsers = this.users.filter(user => 
      user.username.includes(query) || 
      user.name.includes(query) || 
      user.companyName.includes(query)
    );
    this.totalPages = Math.ceil(filteredUsers.length / this.itemsPerPage);
    this.currentPage = 1;
    this.paginatedUsers = filteredUsers.slice(0, this.itemsPerPage);
  }

  updatePaginatedUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUsers = this.users.slice(start, start + this.itemsPerPage);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
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
    const user = this.users.find(u => u.id === id);
    if (user) {
      this.notificationMessage = `¿Eliminar al usuario ${user.username}?`;
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
  }

  editUser(user: User): void {
    this.subscriptions.push(
      this.administracionService.getUserById(user.id).subscribe((fullUser) => {
        this.editingUser = fullUser;
      })
    );
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
      this.hideNotification();
    }
  }

  cancelAction() {
    this.hideNotification();
  }

  sendNotification(message: string, userIds: number[]): void {
    this.administracionService.sendNotification(message, userIds).subscribe(() => {
      console.log('Notificaciones enviadas');
    });
  }
}
