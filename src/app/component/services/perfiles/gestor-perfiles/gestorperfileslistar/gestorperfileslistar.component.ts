import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/component/dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { WarningDialogComponent } from 'src/app/component/dialogo/warning-dialog/warning-dialog.component';
import { Perfil } from 'src/app/model/Perfil';
import { PerfilService } from 'src/app/service/perfil-service.service';

@Component({
  selector: 'app-gestorperfileslistar',
  templateUrl: './gestorperfileslistar.component.html',
  styleUrls: ['./gestorperfileslistar.component.css']
})
export class GestorperfileslistarComponent implements OnInit {
  perfiles: Perfil[] = [];
  serviceId: number = 0;

  constructor(
    private perfilService: PerfilService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = +params['serviceId']; // Convert to number
      this.cargarPerfiles();
    });
  }

  cargarPerfiles(): void {
    this.perfilService.list().subscribe(data => {
      this.perfiles = data.filter(perfil => perfil.service.serviceId === this.serviceId);
    });
  }

  agregarPerfil(): void {
    this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice/crear`]);
  }

  editarPerfil(perfilId: number): void {
    this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice/ediciones/${perfilId}`]);
  }

  eliminarPerfil(perfilId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.perfilService.delete(perfilId).subscribe({
          next: () => {
            this.perfilService.list().subscribe((data) => {
              this.perfiles
            });
          },
          error: (errorMessage) => {
            console.log('Error message:', errorMessage);
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

}
