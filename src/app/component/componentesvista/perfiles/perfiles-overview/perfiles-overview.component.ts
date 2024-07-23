import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilService } from 'src/app/service/perfil-service.service';

@Component({
  selector: 'app-perfiles-overview',
  templateUrl: './perfiles-overview.component.html',
  styleUrls: ['./perfiles-overview.component.css']
})
export class PerfilesOverviewComponent implements OnInit {
  profiles: any[] = [];
  paginatedData: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private router: Router, private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.perfilService.list().subscribe((data) => {
      this.profiles = data;
      this.totalItems = data.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.paginateData();
    });
  }

  viewDetails(profileId: number): void {
    this.router.navigate(['/components/perfil-detail', profileId]);
  }

  filter(event: any): void {
    const query = event.target.value.toLowerCase();
    this.paginatedData = this.profiles.filter(profile => 
      profile.correo.toLowerCase().includes(query) ||
      profile.service.service.toLowerCase().includes(query)
    );
    this.totalItems = this.paginatedData.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.paginateData();
  }

  paginateData(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.profiles.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.paginateData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  addProfile(): void {
    this.router.navigate(['/components/perfiledit/nuevo']);
  }
}
