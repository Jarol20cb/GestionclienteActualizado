import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Socio } from 'src/app/model/socio';
import { LoginService } from 'src/app/service/login.service';
import { SocioService } from 'src/app/service/socio.service';
import { ConfirmDialogComponent } from '../../dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { WarningDialogComponent } from '../../dialogo/warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-listar-socios',
  templateUrl: './listar-socios.component.html',
  styleUrls: ['./listar-socios.component.css']
})
export class ListarSociosComponent implements OnInit{
  dataSource: MatTableDataSource<Socio> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'nombre', 'editar', 'eliminar'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  role: string = "";

  constructor(private cS: SocioService, public dialog: MatDialog, private loginService: LoginService) {}

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
        this.cS.delete(id).subscribe({
          next: () => {
            this.cS.list().subscribe((data) => {
              this.cS.setList(data);
            });
          },
          error: (errorMessage) => {
            console.log('Error message:', errorMessage); // Agrega un log para verificar el mensaje
            this.dialog.open(WarningDialogComponent, {
              data: {
                message: errorMessage
              }
            });
          }
        });
      }
    });
  }

  filter(en: any) {
    this.dataSource.filter = en.target.value.trim();
  }

  verificar() {
    this.role = this.loginService.showRole();
    this.actualizarColumnas();
    return this.loginService.verificar();
  }

  private actualizarColumnas() {
    if (this.role === 'ADMIN' || this.role === 'USER') {
      this.displayedColumns = ['id', 'nombre', 'editar', 'eliminar'];
    }
  }

}
