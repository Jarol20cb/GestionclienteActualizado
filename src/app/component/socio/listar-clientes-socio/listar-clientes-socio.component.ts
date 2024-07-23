import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocioService } from 'src/app/service/socio.service';
import { SocioCustomerService } from 'src/app/model/SocioCustomerService';

@Component({
  selector: 'app-listar-clientes-socio',
  templateUrl: './listar-clientes-socio.component.html',
  styleUrls: ['./listar-clientes-socio.component.css']
})
export class ListarClientesSocioComponent implements OnInit {
  socioCustomerService: SocioCustomerService | null = { socioId: 0, name: '', customerServices: [] };
  socioId: number = 0;
  displayedColumns: string[] = ['idcs', 'name', 'service', 'description', 'fechainicio', 'fechafin', 'estado'];

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  paginatedCustomerServices: any[] = [];
  totalItems: number = 0;


  // Filtros
  filters = {
    name: '',
    service: '',
    fechainicio: '',
    fechafin: '',
    estado: ''
  };

  selectedFilterType: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socioService: SocioService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.socioId = params['socioId'];
      this.loadCustomerServices();
    });
    
  }

  loadCustomerServices() {
    this.socioService.getCustomerServicesBySocioId(this.socioId).subscribe(data => {
      this.socioCustomerService = data;
      this.totalPages = Math.ceil(this.socioCustomerService.customerServices.length / this.itemsPerPage);
      this.updatePagination();
    });
  }

  updatePagination() {
    if (this.socioCustomerService && this.socioCustomerService.customerServices) {
      const filteredServices = this.socioCustomerService.customerServices.filter(service => {
        return (
          service.name.toLowerCase().includes(this.filters.name.toLowerCase()) &&
          service.services.service.toLowerCase().includes(this.filters.service.toLowerCase()) &&
          (!this.filters.fechainicio || new Date(service.fechainicio) >= new Date(this.filters.fechainicio)) &&
          (!this.filters.fechafin || new Date(service.fechafin) <= new Date(this.filters.fechafin)) &&
          service.estado.toLowerCase().includes(this.filters.estado.toLowerCase())
        );
      });

      this.totalPages = Math.ceil(filteredServices.length / this.itemsPerPage);
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedCustomerServices = filteredServices.slice(startIndex, endIndex);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goBack() {
    this.router.navigate(['/components/socios']);
  }

  applyFilters() {
    this.currentPage = 1;
    this.updatePagination();
  }

  updateFilter() {
    this.filters = {
      name: '',
      service: '',
      fechainicio: '',
      fechafin: '',
      estado: ''
    };
    this.applyFilters();
  }

  changePageSize(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(selectElement.value);
    this.currentPage = 1;
    this.updatePagination();
  }
}
