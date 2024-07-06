import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/service/login.service';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';
import { Registro } from 'src/app/model/registro';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  role: string = "";
  username: string = ""; // Nombre de usuario
  name: String = "";
  clientesPendientes: CustomersServices[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  user: Registro = new Registro();
  error: string = "";

  totalUsuarios: number = 0;
  totalDeudores: number = 0;

  constructor(private loginService: LoginService, private dialog: MatDialog, private cS: CustomerserviceService) {}

  ngOnInit(): void {
    this.verificar();
    this.cargarClientesPendientes();
    this.getUserDetails();
    this.cargarEstadisticas();
  }

  verificar() {
    this.role = this.loginService.showRole();
    this.username = this.loginService.showUser();
    this.name = this.loginService.showName();
    return this.loginService.verificar();
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

  getUserDetails() {
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

  cargarEstadisticas() {
    this.cS.list().subscribe((data) => {
      this.totalUsuarios = data.length;
      this.totalDeudores = data.filter(cliente => cliente.estado === 'pendiente').length;
    });
  }
}
