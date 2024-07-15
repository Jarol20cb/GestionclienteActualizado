import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';

@Component({
  selector: 'app-listar-perfil-cliente',
  templateUrl: './listar-perfil-cliente.component.html',
  styleUrls: ['./listar-perfil-cliente.component.css']
})
export class ListarPerfilClienteComponent implements OnInit {
  perfilId: number = 0;
  serviceId: number = 0;
  clientes: CustomersServices[] = [];

  constructor(
    private route: ActivatedRoute,
    private customerserviceService: CustomerserviceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = +params['serviceId'];
      this.perfilId = +params['perfilId'];
      this.loadClientes();
    });
  }

  loadClientes(): void {
    this.customerserviceService.list().subscribe(data => {
      this.clientes = data.filter(cliente => cliente.perfil.perfilId === this.perfilId);
    });
  }
}
