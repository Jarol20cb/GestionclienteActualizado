import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Socio } from 'src/app/model/socio';
import { LoginService } from 'src/app/service/login.service';
import { SocioService } from 'src/app/service/socio.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { WarningDialogComponent } from '../../dialogo/warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-listar-socios',
  templateUrl: './listar-socios.component.html',
  styleUrls: ['./listar-socios.component.css']
})
export class ListarSociosComponent implements OnInit {
  dataSource: Socio[] = [];
  originalDataSource: Socio[] = [];
  displayedColumns: string[] = ['nombre', 'clienteCount', 'verClientes', 'editar', 'eliminar'];
  role: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: Socio[] = [];
  mostrarFormularioRegistro: boolean = false;
  idEdicion: number | null = null;
  totalPages: number = 0;

  constructor(private cS: SocioService, public dialog: MatDialog, private loginService: LoginService, private router: Router) {}

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
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
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

  editarSocio(id: number) {
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
              this.cS.setList(data);
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
    this.dataSource = this.originalDataSource.filter(socio => 
      socio.name.toLowerCase().includes(filterValue) || 
      socio.socioId.toString().includes(filterValue)
    );
    this.totalItems = this.dataSource.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.paginarDatos();
  }

  verificar() {
    this.role = this.loginService.showRole();
    this.actualizarColumnas();
    return this.loginService.verificar();
  }

  verClientes(socioId: number) {
    this.router.navigate([`/components/socios/${socioId}/clientes`]);
  }

  private actualizarColumnas() {
    if (this.role === 'ADMIN' || this.role === 'USER') {
      this.displayedColumns = ['nombre', 'clienteCount', 'verClientes', 'editar', 'eliminar'];
    }
  }

  changePageSize(event: any) {
    this.itemsPerPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.paginarDatos();
  }

  paginarDatos() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.dataSource.slice(start, end);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.paginarDatos();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginarDatos();
    }
  }

  goBack(): void {
    this.router.navigate(['/components/socioproveedor-overview']);
  }
}
