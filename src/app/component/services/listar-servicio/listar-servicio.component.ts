import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Services } from 'src/app/model/Services';
import { LoginService } from 'src/app/service/login.service';
import { ServicesService } from 'src/app/service/services.service';
import { ConfirmDialogComponent } from '../../dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { WarningDialogComponent } from '../../dialogo/warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-listar-servicio',
  templateUrl: './listar-servicio.component.html',
  styleUrls: ['./listar-servicio.component.css']
})
export class ListarServicioComponent implements OnInit {
  dataSource: Services[] = [];
  originalDataSource: Services[] = [];
  displayedColumns: string[] = ['servicio', 'descripcion', 'editar', 'eliminar'];
  role: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: Services[] = [];
  mostrarFormularioRegistro: boolean = false;
  idEdicion: number | null = null;

  constructor(private cS: ServicesService, public dialog: MatDialog, private loginService: LoginService) {}

  ngOnInit(): void {
    this.role = this.loginService.showRole();
    this.actualizarColumnas();
    this.cS.list().subscribe((data) => {
      this.originalDataSource = data;
      this.dataSource = data;
      this.totalItems = data.length;
      this.paginarDatos();
    });
    this.cS.getList().subscribe((data) => {
      this.originalDataSource = data;
      this.dataSource = data;
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

  editarServicio(id: number) {
    this.mostrarFormularioRegistro = true;
    this.idEdicion = id;
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cS.delete(id).subscribe({
          next: () => {
            this.cS.list().subscribe((data) => {
              this.originalDataSource = data;
              this.dataSource = data;
              this.totalItems = data.length;
              this.paginarDatos();
            });
          },
          error: (errorMessage) => {
            console.log('Error message:', errorMessage);
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
    this.dataSource = this.originalDataSource.filter(service =>
      service.service.toLowerCase().includes(filterValue) ||
      service.description.toLowerCase().includes(filterValue)
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

  verificar() {
    this.role = this.loginService.showRole();
    this.actualizarColumnas();
    return this.loginService.verificar();
  }

  private actualizarColumnas() {
    if (this.role === 'ADMIN' || this.role === 'USER') {
      this.displayedColumns = ['servicio', 'descripcion', 'editar', 'eliminar'];
    }
  }
}
