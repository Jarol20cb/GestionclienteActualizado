import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customerservice',
  templateUrl: './customerservice.component.html',
  styleUrls: ['./customerservice.component.css']
})
export class CustomerserviceComponent {
  constructor(public route: ActivatedRoute) {}
  ngOnInit(): void {}
}
