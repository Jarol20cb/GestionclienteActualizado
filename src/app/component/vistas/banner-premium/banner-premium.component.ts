import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner-premium',
  templateUrl: './banner-premium.component.html',
  styleUrls: ['./banner-premium.component.css']
})
export class BannerPremiumComponent {

  constructor(
    private dialogRef: MatDialogRef<BannerPremiumComponent>,
    private router: Router
  ) {}

  onClose() {
    this.dialogRef.close();
  }

  onUpgrade() {
    this.router.navigate(['/components/pago']);
    this.dialogRef.close();
  }
}
