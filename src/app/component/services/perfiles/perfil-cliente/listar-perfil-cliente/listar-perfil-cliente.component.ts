import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';
import { ConfirmDialogComponent } from 'src/app/component/dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { MatDialog } from '@angular/material/dialog';

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
    private router: Router,
    private customerserviceService: CustomerserviceService,
    public dialog: MatDialog
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

  navigateToCrearCliente(): void {
    this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice/${this.perfilId}/crear-perfil-cliente`]);
  }

  navigateToEditarCliente(clienteId: number): void {
    this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice/${this.perfilId}/editar-perfil-cliente/${clienteId}`]);
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.customerserviceService.delete(id).subscribe(() => {
          this.loadClientes();
        });
      }
    });
  }
}
