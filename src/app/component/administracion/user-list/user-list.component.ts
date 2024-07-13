import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
  editingUser: User | null = null; // Añadir esta línea
  private subscription: Subscription = new Subscription();

  constructor(private administracionService: AdministracionService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
    this.subscription = this.administracionService.getList().subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadUsers(): void {
    this.administracionService.list().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  toggleUserStatus(user: User): void {
    const action = user.enabled ? this.administracionService.disable(user.id) : this.administracionService.enable(user.id);
    action.subscribe(() => {
      this.loadUsers(); // Recargar la lista de usuarios después de la acción
    });
  }

  deleteUser(id: number): void {
    this.administracionService.delete(id).subscribe(() => {
      this.loadUsers(); // Recargar la lista de usuarios después de la eliminación
    });
  }

  editUser(user: User): void {
    this.editingUser = { ...user }; // Crear una copia del usuario para editar
  }

  updateUser(): void {
    if (this.editingUser) {
      this.administracionService.update(this.editingUser.id, this.editingUser).subscribe(() => {
        alert('User updated successfully');
        this.editingUser = null;
        this.loadUsers(); // Recargar la lista de usuarios después de la actualización
      });
    }
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  getRoles(user: User): string {
    return user.roles ? user.roles.map(role => role.rol).join(', ') : 'No Roles';
  }
}
