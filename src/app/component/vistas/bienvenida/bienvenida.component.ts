import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';
import { Registro } from 'src/app/model/registro';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {
  user: Registro = new Registro();
  totalUsuarios: number = 0;
  usuariosDeudores: number = 0;
  totalPerfiles = 3;
  usuariosActualesPerfiles = 3;
  usuariosDisponiblesPerfiles = 9;
  isSidebarCollapsed = true; // Por defecto, la barra lateral está cerrada en modo responsive
  isMobile = false;
  clientesPendientes: CustomersServices[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  error: string = "";

  constructor(private loginService: LoginService, private dialog: MatDialog, private cS: CustomerserviceService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserDetails();
    this.cargarClientesPendientes();
    this.cargarEstadisticas();
    this.checkWindowSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowSize();
  }

  checkWindowSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isSidebarCollapsed = true;
    } else {
      this.isSidebarCollapsed = false;
    }
  }

  loadUserDetails() {
    this.loginService.getUserDetails().subscribe(
      data => {
        this.user = data;
      },
      error => {
        this.error = error;
        console.error('Error al obtener los detalles del usuario', error);
      }
    );
  }

  cargarClientesPendientes() {
    this.cS.list().subscribe((data) => {
      this.clientesPendientes = data.filter(cliente => cliente.estado === 'pendiente');
    });
  }

  get paginatedClientes() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.clientesPendientes.slice(start, end);
  }

  nextPage() {
    this.currentPage++;
  }

  previousPage() {
    this.currentPage--;
  }

  cargarEstadisticas() {
    this.cS.list().subscribe((data) => {
      this.totalUsuarios = data.length;
      this.usuariosDeudores = data.filter(cliente => cliente.estado === 'pendiente').length;
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  verPerfil() {
    this.router.navigate(['/components/credentials']);
  }
}
