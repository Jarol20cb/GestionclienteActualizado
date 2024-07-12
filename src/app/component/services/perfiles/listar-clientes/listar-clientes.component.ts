import { Component, OnInit } from '@angular/core';
import { CustomersServices } from 'src/app/model/CustomerService';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { LoginService } from 'src/app/service/login.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.css']
})
export class ListarClientesComponent implements OnInit {
  dataSource: CustomersServices[] = [];
  originalDataSource: CustomersServices[] = [];
  displayedColumns: string[] = ['name', 'correo', 'servicio', 'verPerfil'];
  role: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: CustomersServices[] = [];
  perfilId: number = 0;

  mostrarFormularioRegistro: boolean = false;
  idEdicion: number | null = null;

  constructor(
    private customerserviceService: CustomerserviceService,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.perfilId = +params['perfilId'];
      this.cargarClientes();
    });
    this.customerserviceService.getList().subscribe((data) => {
      this.originalDataSource = data; // Guardar los datos originales
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  cargarClientes() {
    this.customerserviceService.list().subscribe(data => {
      this.originalDataSource = data.filter(cliente => cliente.perfil.perfilId === this.perfilId); // Guardar los datos originales
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  verificar(): boolean {
    return this.loginService.verificar();
  }

  filter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource = this.originalDataSource.filter(cliente =>
      cliente.name.toLowerCase().includes(filterValue) ||
      cliente.perfil.correo.toLowerCase().includes(filterValue) ||
      cliente.services.service.toLowerCase().includes(filterValue)
    );
    this.totalItems = this.dataSource.length;
    this.currentPage = 1;
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
