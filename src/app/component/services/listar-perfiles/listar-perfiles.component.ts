// src/app/components/servicios/listar-perfiles/listar-perfiles.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from 'src/app/service/services.service';
import { Perfil } from 'src/app/model/Perfil';

@Component({
  selector: 'app-listar-perfiles',
  templateUrl: './listar-perfiles.component.html',
  styleUrls: ['./listar-perfiles.component.css']
})
export class ListarPerfilesComponent implements OnInit {
  perfiles: Perfil[] = [];
  serviceId: number = 0;

  constructor(private route: ActivatedRoute, private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = params['serviceId'];
      this.loadPerfiles();
    });
  }

  loadPerfiles() {
    this.servicesService.getPerfilesByServiceId(this.serviceId).subscribe(data => {
      this.perfiles = data;
    });
  }
}
