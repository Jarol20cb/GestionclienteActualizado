import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent {

  constructor(private router: Router) { }

  navigateToSocios(): void {
    this.router.navigate(['/components/socios']);
  }

  navigateToProveedores(): void {
    this.router.navigate(['/components/proveedor']);
  }
}
