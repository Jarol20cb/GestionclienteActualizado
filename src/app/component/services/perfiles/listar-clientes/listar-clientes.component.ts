import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/component/dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { WarningDialogComponent } from 'src/app/component/dialogo/warning-dialog/warning-dialog.component';
import { CustomersServices } from 'src/app/model/CustomerService';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.css']
})
export class ListarClientesComponent {
  
}
