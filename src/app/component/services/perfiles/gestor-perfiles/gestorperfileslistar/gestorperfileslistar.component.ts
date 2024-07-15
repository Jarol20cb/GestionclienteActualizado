import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Perfil } from 'src/app/model/Perfil';
import { PerfilService } from 'src/app/service/perfil-service.service';

@Component({
  selector: 'app-gestorperfileslistar',
  templateUrl: './gestorperfileslistar.component.html',
  styleUrls: ['./gestorperfileslistar.component.css']
})
export class GestorperfileslistarComponent implements OnInit {
  perfiles: Perfil[] = [];
  serviceId: number = 0;

  constructor(
    private perfilService: PerfilService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = +params['serviceId']; // Convert to number
      this.cargarPerfiles();
    });
  }

  cargarPerfiles(): void {
    this.perfilService.list().subscribe(data => {
      this.perfiles = data.filter(perfil => perfil.service.serviceId === this.serviceId);
    });
  }

  agregarPerfil(): void {
    this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice/crear`]);
  }

  editarPerfil(perfilId: number): void {
    this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice/ediciones/${perfilId}`]);
  }
}
