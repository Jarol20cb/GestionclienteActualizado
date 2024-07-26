import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/component/dialogo/confirm-dialog-component/confirm-dialog-component.component';

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

  constructor(private router: Router, private cS: CustomerserviceService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.cS.list().subscribe((data) => {
      this.customers = data;
      this.sortCustomers();
      this.totalItems = data.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.paginateData();
    });
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

  goBack(): void {
    this.router.navigate(['/components/previouspage']); // Ajusta esta ruta según tus necesidades
  }

  sortCustomers(): void {
    const estadoOrder: { [key: string]: number } = { 'pendiente': 1, 'fiado': 2, 'otro': 3 };
    this.customers.sort((a, b) => {
      const estadoA = estadoOrder[a.estado] || estadoOrder['otro'];
      const estadoB = estadoOrder[b.estado] || estadoOrder['otro'];
      return estadoA - estadoB;
    });
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
            console.log(`Cliente con id: ${id} eliminado`);
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
