import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PerfilService } from 'src/app/service/perfil-service.service';
import { ConfirmDialogComponent } from 'src/app/component/dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { Perfil } from 'src/app/model/Perfil';
import { WarningDialogComponent } from 'src/app/component/dialogo/warning-dialog/warning-dialog.component';

interface PerfilExtendido extends Perfil {
  showPassword?: boolean;
}
@Component({
  selector: 'app-perfiles-detail',
  templateUrl: './perfiles-detail.component.html',
  styleUrls: ['./perfiles-detail.component.css']
})
export class PerfilesDetailComponent implements OnInit {
  profile: any;
  showPassword: boolean = false;
  originalDataSource: PerfilExtendido[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private perfilService: PerfilService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const profileId = +this.route.snapshot.paramMap.get('id')!;
    this.perfilService.list().subscribe((data) => {
      this.profile = data.find(p => p.perfilId === profileId);
    });
  }

  // deleteProfile(id: number): void {
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent);
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result === true) {
  //       this.perfilService.delete(id).subscribe(() => {
  //         console.log(`Perfil con id: ${id} eliminado`);
  //         this.router.navigate(['/components/perfil-overview']);
  //       });
  //     }
  //   });
  // }

  deleteProfile(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.perfilService.delete(id).subscribe({
          next: () => {
            this.perfilService.list().subscribe((data) => {
              this.originalDataSource = data.map(item => ({ ...item, showPassword: false }));
            });
          },
          error: (errorMessage) => {
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

  goBack(): void {
    this.router.navigate(['/components/perfil-overview']);
  }

  editProfile(id: number): void {
    this.router.navigate(['/components/perfiledit', id]);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
