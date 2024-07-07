import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { CustomersServices } from 'src/app/model/CustomerService';

@Component({
  selector: 'app-listar-clientes-socio',
  templateUrl: './listar-clientes-socio.component.html',
  styleUrls: ['./listar-clientes-socio.component.css']
})
export class ListarClientesSocioComponent implements OnInit {
  dataSource: MatTableDataSource<CustomersServices> = new MatTableDataSource();
  displayedColumns: string[] = ['idcs', 'name', 'fechainicio', 'fechafin', 'estado'];

  constructor(
    private route: ActivatedRoute,
    private customerserviceService: CustomerserviceService
  ) {}

  ngOnInit(): void {
;
    }
}

