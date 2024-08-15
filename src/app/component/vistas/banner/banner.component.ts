import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BannerComponent>,
    private router: Router
  ) {}

  onAction(action: Function) {
    if (action) {
      action(); // Ejecuta la acción específica del banner
    }
    this.dialogRef.close(); // Cierra el banner después de la acción
  }

  onClose() {
    if (this.data.allowClose) {
      this.dialogRef.close(); // Cierra el banner si se permite cerrarlo
    }
  }

  onLogout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
    this.dialogRef.close();
  }
}
