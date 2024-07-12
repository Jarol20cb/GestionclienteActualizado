import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomersServices } from 'src/app/model/CustomerService';
import { CustomerserviceService } from 'src/app/service/customerservice.service';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.css']
})
export class PerfilClienteComponent implements OnInit {
  cliente: CustomersServices | undefined;
  idcs: number = 0;

  constructor(
    private route: ActivatedRoute,
    private customerserviceService: CustomerserviceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idcs = +params['idcs'];
      this.cargarCliente();
    });
  }

  cargarCliente() {
    this.customerserviceService.listId(this.idcs).subscribe(data => {
      this.cliente = data;
    });
  }
}
