import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from 'src/app/service/services.service';
import { Perfil } from 'src/app/model/Perfil';

@Component({
  selector: 'app-listar-perfiles',
  templateUrl: './listar-perfiles.component.html',
  styleUrls: ['./listar-perfiles.component.css']
})
export class ListarPerfilesComponent implements OnInit {
  perfiles: Perfil[] = [];
  filteredPerfiles: Perfil[] = [];
  paginatedPerfiles: Perfil[] = [];
  serviceId: number = 0;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  selectedFilterType: string = '';
  filters = {
    correo: '',
    proveedor: '',
    fechainicio: '',
    fechafin: ''
  };

  totalPerfiles: number = 0;
  totalUsuarios: number = 0;
  usuariosDisponibles: number = 0;

  constructor(private route: ActivatedRoute, private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = params['serviceId'];
      this.loadPerfiles();
    });
  }

  loadPerfiles() {
    this.servicesService.getPerfilesByServiceId(this.serviceId).subscribe(data => {
      this.perfiles = data;
      this.filteredPerfiles = data;
      this.updateStats();
      this.totalPages = Math.ceil(this.filteredPerfiles.length / this.itemsPerPage);
      this.updatePagination();
    });
  }

  updateStats() {
    this.totalPerfiles = this.perfiles.length;
    this.totalUsuarios = this.perfiles.reduce((sum, perfil) => sum + perfil.usuariosActuales, 0);
    this.usuariosDisponibles = this.perfiles.reduce((sum, perfil) => sum + perfil.usuariosDisponibles, 0);
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPerfiles = this.filteredPerfiles.slice(startIndex, endIndex);
  }

  applyFilters() {
    this.filteredPerfiles = this.perfiles.filter(perfil => {
      return (
        perfil.correo.toLowerCase().includes(this.filters.correo.toLowerCase()) &&
        perfil.proveedor.nombre.toLowerCase().includes(this.filters.proveedor.toLowerCase()) &&
        (!this.filters.fechainicio || new Date(perfil.fechainicio) >= new Date(this.filters.fechainicio)) &&
        (!this.filters.fechafin || new Date(perfil.fechafin) <= new Date(this.filters.fechafin))
      );
    });
    this.totalPages = Math.ceil(this.filteredPerfiles.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagination();
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

  updateFilter() {
    this.filters = {
      correo: '',
      proveedor: '',
      fechainicio: '',
      fechafin: ''
    };
    this.applyFilters();
  }
}
