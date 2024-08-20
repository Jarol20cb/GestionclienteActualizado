import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { LoginService } from 'src/app/service/login.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ConfirmDialogComponent } from 'src/app/component/dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { ConfirmarRenovacionDialogComponent } from 'src/app/component/confirmar-renovacion-dialog/confirmar-renovacion-dialog.component';
import * as moment from 'moment';
import { CustomersServices } from 'src/app/model/CustomerService';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const centeredStyle = {
  alignment: { vertical: 'center', horizontal: 'center' },
  border: {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } }
  }
};

@Component({
  selector: 'app-customer-overview',
  templateUrl: './customer-overview.component.html',
  styleUrls: ['./customer-overview.component.css']
})
export class CustomerOverviewComponent implements OnInit {
  customers: CustomersServices[] = [];
  paginatedData: CustomersServices[] = [];
  selectedCustomers: CustomersServices[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  selectionMode: boolean = false;
  role: string = '';
  fabMenuVisible: boolean = false;

  constructor(private router: Router, private cS: CustomerserviceService, public dialog: MatDialog, private loginService: LoginService) {}

  ngOnInit(): void {
    this.role = this.loginService.showRole();
    this.cS.list().subscribe((data) => {
      data.forEach(this.checkAndUpdateEstado.bind(this));
      data.sort((a, b) => this.ordenarEstados(a, b));
      this.customers = data;
      this.totalItems = data.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.paginateData();
    });
  }
  
  toggleFabMenu() {
    this.fabMenuVisible = !this.fabMenuVisible;
  }

  viewDetails(customerId: number): void {
    this.router.navigate(['/components/customer-detail', customerId]);
  }

  filter(event: any): void {
    const query = event.target.value.toLowerCase();
    this.paginatedData = this.customers.filter(customer => 
      customer.name.toLowerCase().includes(query) ||
      customer.services.service.toLowerCase().includes(query)
    );
    this.totalItems = this.paginatedData.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.paginateData();
  }

  paginateData(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.customers.slice(start, end);
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

  addCustomer(): void {
    this.router.navigate(['/components/customeredit/nuevo']);
    console.log('Añadir cliente');
  }

  vermensajes(): void {
    this.router.navigate(['/components/mensajes']);
  }

  cambiarEstado(element: CustomersServices) {
    const dialogRef = this.dialog.open(ConfirmarRenovacionDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (element.estado === 'pendiente') {
          element.estado = 'cancelado';
          const startDate = new Date(element.fechafin);
          const endDate = new Date(startDate);
          startDate.setMonth(startDate.getMonth());
          endDate.setMonth(startDate.getMonth() + 1);

          element.fechainicio = startDate;
          element.fechafin = endDate;

          this.cS.update(element).subscribe(() => {
            this.cS.list().subscribe((data) => {
              data.forEach(this.checkAndUpdateEstado.bind(this));
              data.sort((a, b) => this.ordenarEstados(a, b));
              this.customers = data;
              this.totalItems = data.length;
              this.paginateData();
            });
          });
        } else {
          alert('El estado no se puede cambiar porque ya está actualizado.');
        }
      }
    });
  }

  checkAndUpdateEstado(element: CustomersServices) {
    const today = new Date();
    const endDate = new Date(element.fechafin);
    const oneMonthAfterStart = new Date(element.fechainicio);
    oneMonthAfterStart.setMonth(oneMonthAfterStart.getMonth() + 1);

    if (today > oneMonthAfterStart && element.estado === 'cancelado') {
      element.estado = 'pendiente';
      this.cS.update(element).subscribe(() => {
        this.cS.list().subscribe((data) => {
          data.sort((a, b) => this.ordenarEstados(a, b));
          this.customers = data;
          this.totalItems = data.length;
          this.paginateData();
        });
      });
    }
  }

  ordenarEstados(a: CustomersServices, b: CustomersServices): number {
    if (a.estado === 'pendiente' && b.estado !== 'pendiente') {
      return -1;
    } else if (a.estado !== 'pendiente' && b.estado === 'pendiente') {
      return 1;
    } else if (a.estado === 'fiado' && b.estado !== 'fiado') {
      return -1;
    } else if (a.estado !== 'fiado' && b.estado === 'fiado') {
      return 1;
    } else {
      return 0;
    }
  }

  getEstadoColor(element: CustomersServices): string {
    if (element.estado === 'pendiente') {
      return 'red';
    } else if (element.estado === 'cancelado') {
      return 'green';
    } else if (element.estado === 'fiado') {
      return 'orange';
    } else {
      return '';
    }
  }

  exportToExcel() {
    const flattenedData = this.customers.map(item => ({
      'Cliente': item.name,
      'Tipo de servicio': item.services?.service,
      'Perfil': item.perfil?.correo,
      'Socio': item.socio?.name,
      'Fecha de Inicio': moment(item.fechainicio).format('DD/MM/YYYY'),
      'Fecha de pagos': moment(item.fechafin).format('DD/MM/YYYY'),
      'Estado de la cuenta': item.estado
    }));
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  
    setTimeout(() => {
      const range = XLSX.utils.decode_range(worksheet['!ref']!);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = { c: C, r: R };
          const cell_ref = XLSX.utils.encode_cell(cell_address);
          if (!worksheet[cell_ref]) continue;
          if (!worksheet[cell_ref].s) worksheet[cell_ref].s = {};
          worksheet[cell_ref].s = centeredStyle;
        }
      }
  
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'CustomerServices');
    }, 0);
  }
  
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }

  toggleSelectionMode(): void {
    this.selectionMode = !this.selectionMode;
    if (!this.selectionMode) {
      this.customers.forEach(customer => customer.selected = false);
      this.updateSelectedCustomers();
    }
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.paginatedData.forEach(customer => customer.selected = isChecked);
    this.updateSelectedCustomers();
  }

  areAllSelected(): boolean {
    return this.paginatedData.length > 0 && this.paginatedData.every(customer => customer.selected);
  }

  updateSelectedCustomers(): void {
    this.selectedCustomers = this.customers.filter(customer => customer.selected);
  }

  eliminarSeleccionados(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const idsToDelete = this.selectedCustomers.map(customer => customer.idcs);
        idsToDelete.forEach(id => {
          this.cS.delete(id).subscribe(() => {
            this.customers = this.customers.filter(customer => customer.idcs !== id);
            this.updateSelectedCustomers();
            this.totalItems = this.customers.length;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            this.paginateData();
          });
        });
      }
    });
  }
}
