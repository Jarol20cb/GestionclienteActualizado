import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';
import { ConfirmDialogComponent } from 'src/app/component/dialogo/confirm-dialog-component/confirm-dialog-component.component';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  customer: CustomersServices | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cS: CustomerserviceService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const customerId = +this.route.snapshot.paramMap.get('id')!;
    this.cS.list().subscribe((data) => {
      this.customer = data.find(c => c.idcs === customerId);
    });
  }

  eliminarCliente(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cS.delete(id).subscribe(() => {
          console.log(`Cliente con id: ${id} eliminado`);
          this.router.navigate(['/components/customer-overview']);
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/components/customer-overview']);
  }

  editarClienteServicio(id: number) {
    if (id) {
      this.router.navigate(['/components/customeredit', id]);
    } else {
      console.error('ID del cliente no disponible para la edición.');
    }
  }

  getWhatsAppUrl(number: string): string {
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = this.customer?.fechainicio
      ? new Date(this.customer.fechainicio).toLocaleDateString('es-ES', dateOptions)
      : '';
    const formattedDateWithArticle = formattedDate.replace('de', 'del');
    const message = `Estimado usuario, se le recuerda que debe cancelar su servicio de ${this.customer?.services?.service}, su perfil es ${this.customer?.perfil?.correo} y su fecha de contrato fue el ${formattedDateWithArticle}`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }
  
  
  
}
