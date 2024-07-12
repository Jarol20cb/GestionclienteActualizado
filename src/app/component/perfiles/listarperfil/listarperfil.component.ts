import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Perfil } from 'src/app/model/Perfil';
import { PerfilService } from 'src/app/service/perfil-service.service';
import { ConfirmDialogComponent } from '../../dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { WarningDialogComponent } from '../../dialogo/warning-dialog/warning-dialog.component';

interface PerfilExtendido extends Perfil {
  showPassword?: boolean;
}

@Component({
  selector: 'app-listarperfil',
  templateUrl: './listarperfil.component.html',
  styleUrls: ['./listarperfil.component.css']
})
export class ListarperfilComponent implements OnInit {
  dataSource: PerfilExtendido[] = [];
  originalDataSource: PerfilExtendido[] = []; // Nueva variable para mantener los datos originales
  displayedColumns: string[] = ['id', 'servicio', 'correo', 'contrasena', 'fechainicio', 'fechafin', 'limiteUsuarios', 'usuariosActuales', 'usuariosDisponibles', 'proveedor', 'editar', 'eliminar'];
  role: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: PerfilExtendido[] = [];

  mostrarFormularioRegistro: boolean = false;
  idEdicion: number | null = null;

  constructor(private perfilService: PerfilService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.perfilService.list().subscribe((data) => {
      this.originalDataSource = data.map(item => ({ ...item, showPassword: false })); // Guardar los datos originales
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
    this.perfilService.getList().subscribe((data) => {
      this.originalDataSource = data.map(item => ({ ...item, showPassword: false })); // Guardar los datos originales
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  mostrarFormulario() {
    this.mostrarFormularioRegistro = true;
    this.idEdicion = null;
  }

  ocultarFormulario() {
    this.mostrarFormularioRegistro = false;
  }

  cerrarFormulario() {
    this.ocultarFormulario();
  }

  editarPerfil(id: number) {
    this.mostrarFormularioRegistro = true;
    this.idEdicion = id;
  }

  togglePasswordVisibility(element: PerfilExtendido) {
    element.showPassword = !element.showPassword;
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.perfilService.delete(id).subscribe({
          next: () => {
            this.perfilService.list().subscribe((data) => {
              this.originalDataSource = data.map(item => ({ ...item, showPassword: false })); // Guardar los datos originales
              this.dataSource = [...this.originalDataSource];
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
    this.dataSource = this.originalDataSource.filter(perfil => // Usar originalDataSource para filtrar
      perfil.correo.toLowerCase().includes(filterValue) ||
      perfil.service.service.toLowerCase().includes(filterValue) ||
      perfil.proveedor.nombre.toLowerCase().includes(filterValue)
    );
    this.totalItems = this.dataSource.length;
    this.currentPage = 1;
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
