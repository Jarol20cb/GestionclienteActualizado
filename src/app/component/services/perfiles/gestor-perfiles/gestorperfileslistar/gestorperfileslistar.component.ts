import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Perfil } from 'src/app/model/Perfil';
import { PerfilService } from 'src/app/service/perfil-service.service';
import { ConfirmDialogComponent } from 'src/app/component/dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { WarningDialogComponent } from 'src/app/component/dialogo/warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-gestorperfileslistar',
  templateUrl: './gestorperfileslistar.component.html',
  styleUrls: ['./gestorperfileslistar.component.css']
})
export class GestorperfileslistarComponent implements OnInit {
  perfiles: Perfil[] = [];
  originalData: Perfil[] = [];
  paginatedData: Perfil[] = [];
  serviceId: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  constructor(
    private perfilService: PerfilService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = +params['serviceId'];
      this.cargarPerfiles();
    });
  }

  cargarPerfiles(): void {
    this.perfilService.list().subscribe(data => {
      this.perfiles = data.filter(perfil => perfil.service.serviceId === this.serviceId);
      this.originalData = this.perfiles;
      this.totalItems = this.perfiles.length;
      this.paginarDatos();
    });
  }

  agregarPerfil(): void {
    this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice/crear`]);
  }

  editarPerfil(perfilId: number): void {
    this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice/ediciones/${perfilId}`]);
  }

  eliminarPerfil(perfilId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.perfilService.delete(perfilId).subscribe({
          next: () => {
            this.cargarPerfiles();
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
    this.perfiles = this.originalData.filter(perfil => 
      perfil.correo.toLowerCase().includes(filterValue) || 
      perfil.proveedor.nombre.toLowerCase().includes(filterValue)
    );
    this.totalItems = this.perfiles.length;
    this.currentPage = 1;
    this.paginarDatos();
  }

  navigateToServicio(): void {
    this.router.navigate([`/components/servicios`]);
  }

  changePageSize(event: any) {
    this.itemsPerPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.paginarDatos();
  }

  paginarDatos() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.perfiles.slice(start, end);
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
}
