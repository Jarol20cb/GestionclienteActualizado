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
      action();
    }
    this.dialogRef.close();
  }

  onClose() {
    if (this.data.allowClose) {
      this.dialogRef.close();
    }
  }

  onLogout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
    this.dialogRef.close();
  }
}
