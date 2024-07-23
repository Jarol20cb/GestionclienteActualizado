import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/component/dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { WarningDialogComponent } from 'src/app/component/dialogo/warning-dialog/warning-dialog.component';
import { Services } from 'src/app/model/Services';
import { ServicesService } from 'src/app/service/services.service';

@Component({
  selector: 'app-servicios-overview',
  templateUrl: './servicios-overview.component.html',
  styleUrls: ['./servicios-overview.component.css']
})
export class ServiciosOverviewComponent implements OnInit {
  services: any[] = [];
  paginatedData: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  mostrarFormularioRegistro: boolean = false;
  idEdicion: number | null = null;
  role: string = "ADMIN";
  originalDataSource: Services[] = [];

  constructor(private router: Router, private servicesService: ServicesService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.servicesService.list().subscribe((data) => {
      this.services = data;
      this.totalItems = data.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.paginateData();
    });
  }

  verPerfiles(serviceId: number): void {
    this.router.navigate(['/components/servicios', serviceId, 'perfilesservice']);
  }

  editarServicio(serviceId: number): void {
    this.mostrarFormularioRegistro = true;
    this.idEdicion = serviceId;
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.servicesService.delete(id).subscribe({
          next: () => {
            this.servicesService.list().subscribe((data) => {
              this.originalDataSource = data;
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

  filter(event: any): void {
    const query = event.target.value.toLowerCase();
    this.paginatedData = this.services.filter(service => 
      service.service.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query)
    );
    this.totalItems = this.paginatedData.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.paginateData();
  }

  paginateData(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.services.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.paginateData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  addService(): void {
    this.router.navigate(['/components/servicioedit/nuevo']);
  }

  editService(id: number): void {
    this.router.navigate(['/components/servicioedit', id]);
  }

}
