import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Perfil } from 'src/app/model/Perfil';
import { PerfilService } from 'src/app/service/perfil-service.service';
import { ProveedorService } from 'src/app/service/proveedor-service.service';
import { Proveedor } from 'src/app/model/Proveedor';

@Component({
  selector: 'app-gestorperfilescrear',
  templateUrl: './gestorperfilescrear.component.html',
  styleUrls: ['./gestorperfilescrear.component.css']
})
export class GestorperfilescrearComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  perfil: Perfil = new Perfil();
  mensaje: string = '';
  proveedores: Proveedor[] = [];
  serviceId: number = 0;
  perfilId: number | null = null;  // Para almacenar el ID del perfil en edición
  edicion: boolean = false;

  constructor(
    private perfilService: PerfilService,
    private proveedorService: ProveedorService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = +params['serviceId'];
      if (params['perfilId']) {
        this.perfilId = +params['perfilId'];
        this.edicion = true;
        this.loadPerfil();
      } else {
        this.edicion = false;
      }
    });

    this.form = this.formBuilder.group({
      correo: ['', Validators.required],
      contrasena: ['', Validators.required],
      fechainicio: ['', Validators.required],
      fechafin: ['', Validators.required],
      limiteUsuarios: ['', [Validators.required, Validators.min(1)]],
      proveedor: ['', Validators.required]
    });

    this.proveedorService.list().subscribe(data => {
      this.proveedores = data;
    });
  }

  loadPerfil(): void {
    if (this.perfilId) {
      this.perfilService.listId(this.perfilId).subscribe(data => {
        this.perfil = data;
        this.form.patchValue({
          correo: this.perfil.correo,
          contrasena: this.perfil.contrasena,
          fechainicio: this.formatDate(this.perfil.fechainicio),
          fechafin: this.formatDate(this.perfil.fechafin),
          limiteUsuarios: this.perfil.limiteUsuarios,
          proveedor: this.perfil.proveedor.proveedorId
        });
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toISOString().substring(0, 10);
  }

  aceptar(): void {
    if (this.form.valid) {
      this.perfil.service.serviceId = this.serviceId;
      this.perfil.correo = this.form.value.correo;
      this.perfil.contrasena = this.form.value.contrasena;
      this.perfil.fechainicio = new Date(this.form.value.fechainicio);
      this.perfil.fechafin = new Date(this.form.value.fechafin);
      this.perfil.limiteUsuarios = this.form.value.limiteUsuarios;
      this.perfil.proveedor.proveedorId = this.form.value.proveedor;

      if (this.edicion) {
        this.perfilService.update(this.perfil).subscribe(() => {
          this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice`]);
        });
      } else {
        this.perfilService.insert(this.perfil).subscribe(() => {
          this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice`]);
        });
      }
    } else {
      this.mensaje = "Ingrese todos los campos!!!";
    }
  }

  cancelar(): void {
    this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice`]);
  }
}
