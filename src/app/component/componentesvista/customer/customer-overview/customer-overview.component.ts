import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';

@Component({
  selector: 'app-customer-overview',
  templateUrl: './customer-overview.component.html',
  styleUrls: ['./customer-overview.component.css']
})
export class CustomerOverviewComponent implements OnInit {
  customers: CustomersServices[] = [];
  paginatedData: CustomersServices[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  

  constructor(private router: Router, private cS: CustomerserviceService) {}

  ngOnInit(): void {
    this.cS.list().subscribe((data) => {
      this.customers = data;
      this.sortCustomers();
      this.totalItems = data.length;
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

  sortCustomers(): void {
    const estadoOrder: { [key: string]: number } = { 'pendiente': 1, 'fiado': 2, 'otro': 3 };
    this.customers.sort((a, b) => {
      const estadoA = estadoOrder[a.estado] || estadoOrder['otro'];
      const estadoB = estadoOrder[b.estado] || estadoOrder['otro'];
      return estadoA - estadoB;
    });
  }
  
}
