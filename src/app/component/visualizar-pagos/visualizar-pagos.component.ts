import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CustomersServices } from 'src/app/model/CustomerService';
import { CustomerserviceService } from 'src/app/service/customerservice.service';

@Component({
  selector: 'app-visualizar-pagos',
  templateUrl: './visualizar-pagos.component.html',
  styleUrls: ['./visualizar-pagos.component.css']
})
export class VisualizarPagosComponent implements OnInit {
  deudores: number = 0;
  alDia: number = 0;
  total: number = 0;

  constructor(private cS: CustomerserviceService) { }

  ngOnInit(): void {
    this.cS.list().subscribe((data: CustomersServices[]) => {
      this.processData(data);
    });
  }

  processData(data: CustomersServices[]): void {
    const today = moment();

    data.forEach(cs => {
      const endDate = moment(cs.fechafin);
      if (endDate.isBefore(today) && cs.estado !== 'cancelado') {
        this.deudores++;
      } else {
        this.alDia++;
      }
    });

    this.total = this.deudores + this.alDia;
  }

  getBarHeight(count: number): string {
    return this.total > 0 ? `${(count / this.total) * 100}%` : '0%';
  }
}
