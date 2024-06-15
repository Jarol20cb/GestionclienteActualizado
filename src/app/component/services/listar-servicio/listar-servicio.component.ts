import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Services } from 'src/app/model/Services';
import { LoginService } from 'src/app/service/login.service';
import { ServicesService } from 'src/app/service/services.service';
import { ConfirmDialogComponent } from '../../dialogo/confirm-dialog-component/confirm-dialog-component.component';

@Component({
  selector: 'app-listar-servicio',
  templateUrl: './listar-servicio.component.html',
  styleUrls: ['./listar-servicio.component.css']
})
export class ListarServicioComponent implements OnInit{
  dataSource: MatTableDataSource<Services> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'servicio', 'descripcion', 'editar', 'eliminar'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private cS: ServicesService, public dialog: MatDialog, private loginService: LoginService) {}

  ngOnInit(): void {
    this.role = this.loginService.showRole();
    this.actualizarColumnas();
    this.cS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.cS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cS.delete(id).subscribe((data) => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      }
    });
  }

  filter(en: any) {
    this.dataSource.filter = en.target.value.trim();
  }

  role: string = "";

  verificar() {
    this.role = this.loginService.showRole();
    this.actualizarColumnas();
    return this.loginService.verificar();
  }
  private actualizarColumnas() {
    if (this.role === 'ADMIN' || this.role === 'USER') {
      this.displayedColumns = ['id', 'servicio', 'descripcion', 'editar', 'eliminar'];
    }
  }
}
