import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/service/login.service';
import { CustomersServices } from 'src/app/model/CustomerService';
import { ConfirmDialogComponent } from '../../dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { ConfirmarRenovacionDialogComponent } from '../../confirmar-renovacion-dialog/confirmar-renovacion-dialog.component';
import * as moment from 'moment';
import { CustomerserviceService } from 'src/app/service/customerservice.service';

@Component({
  selector: 'app-listar-cs',
  templateUrl: './listar-cs.component.html',
  styleUrls: ['./listar-cs.component.css']
})
export class ListarCsComponent implements OnInit {
  dataSource: MatTableDataSource<CustomersServices> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'clientes', 'servicio', 'fechainicio', 'fechafin', 'estado', 'socio', 'cambiarEstado', 'editar', 'eliminar'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  role: string = '';

  constructor(private cS: CustomerserviceService, public dialog: MatDialog, private loginService: LoginService) {}

  ngOnInit(): void {
    this.role = this.loginService.showRole();
    this.actualizarColumnas();
    this.cS.list().subscribe((data) => {
      data.forEach(this.checkAndUpdateEstado.bind(this));
      data.sort((a, b) => this.ordenarPendientes(a, b));
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.cS.getList().subscribe((data) => {
      data.forEach(this.checkAndUpdateEstado.bind(this));
      data.sort((a, b) => this.ordenarPendientes(a, b));
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  verificar(): boolean {
    return this.loginService.verificar();
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cS.delete(id).subscribe(() => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      }
    });
  }

  cambiarEstado(element: CustomersServices) {
    const dialogRef = this.dialog.open(ConfirmarRenovacionDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (element.estado === 'pendiente') {
          element.estado = 'cancelado';
          const startDate = new Date(element.fechafin);
          const endDate = new Date(startDate);
          startDate.setMonth(startDate.getMonth());
          endDate.setMonth(startDate.getMonth() + 1);

          element.fechainicio = startDate;
          element.fechafin = endDate;

          this.cS.update(element).subscribe(() => {
            this.cS.list().subscribe((data) => {
              data.forEach(this.checkAndUpdateEstado.bind(this));
              data.sort((a, b) => this.ordenarPendientes(a, b));
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
            });
          });
        } else {
          alert('El estado no se puede cambiar porque ya está actualizado.');
        }
      }
    });
  }

  filter(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  isOverdue(customerService: CustomersServices): boolean {
    const today = moment();
    const endDate = moment(customerService.fechafin);
    return endDate.isBefore(today) && customerService.estado !== 'cancelado';
  }

  ordenarPendientes(a: CustomersServices, b: CustomersServices): number {
    if (a.estado === 'pendiente' && b.estado !== 'pendiente') {
      return -1;
    } else if (a.estado !== 'pendiente' && b.estado === 'pendiente') {
      return 1;
    } else {
      return 0;
    }
  }

  actualizarColumnas() {
    if (this.role === 'ADMIN') {
      this.displayedColumns = ['id', 'clientes', 'servicio', 'fechainicio', 'fechafin', 'estado', 'socio', 'cambiarEstado', 'editar', 'eliminar'];
    }
    if(this.role === 'USER'){
      this.displayedColumns = ['clientes', 'servicio', 'fechainicio', 'fechafin', 'estado', 'socio', 'cambiarEstado', 'editar', 'eliminar'];
    }
  }

  getRowClass(element: CustomersServices): string {
    return element.estado === 'pendiente' ? 'pendiente-row' : '';
  }

  getEstadoClass(element: CustomersServices): string {
    return element.estado === 'pendiente' ? 'pendiente-estado' : '';
  }

  checkAndUpdateEstado(element: CustomersServices) {
    const today = new Date();
    const endDate = new Date(element.fechafin);
    const oneMonthAfterStart = new Date(element.fechainicio);
    oneMonthAfterStart.setMonth(oneMonthAfterStart.getMonth() + 1);

    if (today > oneMonthAfterStart && element.estado === 'cancelado') {
      element.estado = 'pendiente';
      this.cS.update(element).subscribe(() => {
        this.cS.list().subscribe((data) => {
          data.sort((a, b) => this.ordenarPendientes(a, b));
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
        });
      });
    }
  }
}
