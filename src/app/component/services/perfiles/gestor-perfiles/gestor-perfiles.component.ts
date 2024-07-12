import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/component/dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { WarningDialogComponent } from 'src/app/component/dialogo/warning-dialog/warning-dialog.component';
import { Perfil } from 'src/app/model/Perfil';
import { LoginService } from 'src/app/service/login.service';
import { PerfilService } from 'src/app/service/perfil-service.service';
interface PerfilExtendido extends Perfil {
  showPassword?: boolean;
}
@Component({
  selector: 'app-gestor-perfiles',
  templateUrl: './gestor-perfiles.component.html',
  styleUrls: ['./gestor-perfiles.component.css']
})
export class GestorPerfilesComponent implements OnInit{

  dataSource: PerfilExtendido[] = [];
  originalDataSource: PerfilExtendido[] = []; // Nueva variable para mantener los datos originales
  displayedColumns: string[] = ['servicio', 'correo', 'contrasena', 'fechainicio', 'fechafin', 'limiteUsuarios', 'usuariosActuales', 'usuariosDisponibles', 'proveedor', 'verClientes', 'editar', 'eliminar'];
  role: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: PerfilExtendido[] = [];
  serviceId: number = 0;

  mostrarFormularioRegistro: boolean = false;
  idEdicion: number | null = null;

  constructor(
    private perfilService: PerfilService,
    public dialog: MatDialog,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = +params['serviceId'];
      this.cargarPerfiles();
    });
    this.perfilService.getList().subscribe((data) => {
      this.originalDataSource = data.map(item => ({ ...item, showPassword: false })); // Guardar los datos originales
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  cargarPerfiles() {
    this.perfilService.findAvailableByService(this.serviceId).subscribe(data => {
      this.originalDataSource = data.map(item => ({ ...item, showPassword: false })); // Guardar los datos originales
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  actualizarColumnas() {
    if (this.role === 'ADMIN') {
      this.displayedColumns = ['servicio', 'correo', 'contrasena', 'fechainicio', 'fechafin', 'limiteUsuarios', 'usuariosActuales', 'usuariosDisponibles', 'proveedor', 'verClientes', 'editar', 'eliminar'];
    }
    if (this.role === 'CUSTOMER') {
      this.displayedColumns = ['servicio', 'correo', 'contrasena', 'fechainicio', 'fechafin', 'limiteUsuarios', 'usuariosActuales', 'usuariosDisponibles', 'proveedor', 'verClientes', 'editar', 'eliminar'];
    }
  }

  verificar() {
    this.role = this.loginService.showRole();
    this.actualizarColumnas();
    return this.loginService.verificar();
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
            this.cargarPerfiles();
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
