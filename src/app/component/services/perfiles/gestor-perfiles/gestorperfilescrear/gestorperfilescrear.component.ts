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
  serviceId: number = 0;
  proveedores: Proveedor[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private perfilService: PerfilService,
    private proveedorService: ProveedorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = params['serviceId'];
      this.initForm();
      this.cargarProveedores();
    });
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      correo: ['', Validators.required],
      contrasena: ['', Validators.required],
      fechainicio: ['', Validators.required],
      fechafin: ['', Validators.required],
      limiteUsuarios: ['', [Validators.required, Validators.min(1)]],
      proveedor: ['', Validators.required]
    });
  }

  cargarProveedores(): void {
    this.proveedorService.list().subscribe(data => {
      this.proveedores = data;
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      const perfil = new Perfil();
      perfil.service.serviceId = this.serviceId;
      perfil.correo = this.form.value.correo;
      perfil.contrasena = this.form.value.contrasena;
      perfil.fechainicio = this.form.value.fechainicio;
      perfil.fechafin = this.form.value.fechafin;
      perfil.limiteUsuarios = this.form.value.limiteUsuarios;
      perfil.proveedor.proveedorId = this.form.value.proveedor;

      this.perfilService.insert(perfil).subscribe(() => {
        this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice`]);
      });
    }
  }

  cancelar(): void {
    this.router.navigate([`/components/servicios/${this.serviceId}/perfilesservice`]);
  }
}
