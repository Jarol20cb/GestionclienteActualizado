
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-renovacion-dialog',
  templateUrl: './confirmar-renovacion-dialog.component.html',
  styleUrls: ['./confirmar-renovacion-dialog.component.css']
})
export class ConfirmarRenovacionDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmarRenovacionDialogComponent>) {}

  confirm(result: boolean): void {
    this.dialogRef.close(result);
  }
}
