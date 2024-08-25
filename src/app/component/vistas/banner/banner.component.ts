import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit{

  showBackButton: boolean = false; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BannerComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkBackButtonVisibility(this.router.url);
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkBackButtonVisibility(event.urlAfterRedirects);
    });
  }

  checkBackButtonVisibility(url: string): void {
    this.showBackButton = url !== '/components/pago';
  }

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
