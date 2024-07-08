import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Perfil } from 'src/app/model/Perfil';
import { PerfilService } from 'src/app/service/perfil-service.service';
import { ConfirmDialogComponent } from '../../dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { WarningDialogComponent } from '../../dialogo/warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-listarperfil',
  templateUrl: './listarperfil.component.html',
  styleUrls: ['./listarperfil.component.css']
})
export class ListarperfilComponent implements OnInit{
  dataSource: Perfil[] = [];
  displayedColumns: string[] = ['id', 'correo', 'contrasena', 'fechainicio', 'fechafin', 'limiteUsuarios', 'usuariosActuales', 'usuariosDisponibles', 'proveedor', 'editar', 'eliminar'];
  role: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: Perfil[] = [];

  constructor(private perfilService: PerfilService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.perfilService.list().subscribe((data) => {
      this.dataSource = data;
      this.totalItems = data.length;
      this.paginarDatos();
    });
    this.perfilService.getList().subscribe((data) => {
      this.dataSource = data;
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.perfilService.delete(id).subscribe({
          next: () => {
            this.perfilService.list().subscribe((data) => {
              this.dataSource = data;
              this.totalItems = data.length;
              this.paginarDatos();
            });
          },
          error: (errorMessage) => {
            this.dialog.open(WarningDialogComponent, {
              data: {
                message: errorMessage
              }
            });
          }
        });
      }
    });
  }

  filter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.paginatedData = this.dataSource.filter(perfil =>
      perfil.correo.toLowerCase().includes(filterValue)
    );
    this.totalItems = this.paginatedData.length;
    this.paginarDatos();
  }

  changePageSize(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
    this.paginarDatos();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginarDatos();
    }
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.paginarDatos();
    }
  }

  paginarDatos() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.dataSource.slice(start, end);
  }
}
