import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/service/login.service';
import { CerrarSesionComponent } from '../dialogo/cerrar-sesion/cerrar-sesion.component';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  role: string = "";
  username: string = "";
  clientesPendientes: CustomersServices[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private loginService: LoginService, private dialog: MatDialog, private cS: CustomerserviceService) {}

  ngOnInit(): void {
    this.verificar();
    this.cargarClientesPendientes();
  }

  verificar() {
    this.role = this.loginService.showRole();
    this.username = this.loginService.showUser();
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
}
