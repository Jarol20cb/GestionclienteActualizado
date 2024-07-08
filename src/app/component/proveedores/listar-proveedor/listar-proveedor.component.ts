// listar-proveedor.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Proveedor } from 'src/app/model/Proveedor';
import { ConfirmDialogComponent } from '../../dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { WarningDialogComponent } from '../../dialogo/warning-dialog/warning-dialog.component';
import { ProveedorService } from 'src/app/service/proveedor-service.service';

@Component({
  selector: 'app-listar-proveedor',
  templateUrl: './listar-proveedor.component.html',
  styleUrls: ['./listar-proveedor.component.css']
})
export class ListarProveedorComponent implements OnInit {
  dataSource: Proveedor[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'editar', 'eliminar'];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: Proveedor[] = [];

  constructor(private proveedorService: ProveedorService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.proveedorService.list().subscribe((data) => {
      this.dataSource = data;
      this.totalItems = data.length;
      this.paginarDatos();
    });
    this.proveedorService.getList().subscribe((data) => {
      this.dataSource = data;
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.proveedorService.delete(id).subscribe({
          next: () => {
            this.proveedorService.list().subscribe((data) => {
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
    this.paginatedData = this.dataSource.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(filterValue)
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
