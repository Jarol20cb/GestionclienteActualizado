import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Perfil } from 'src/app/model/Perfil';
import { ServicesService } from 'src/app/service/services.service';
import { Services } from 'src/app/model/Services';
import { Proveedor } from 'src/app/model/Proveedor';
import { PerfilService } from 'src/app/service/perfil-service.service';
import { ProveedorService } from 'src/app/service/proveedor-service.service';

@Component({
  selector: 'app-creacion-perfil',
  templateUrl: './creacion-perfil.component.html',
  styleUrls: ['./creacion-perfil.component.css']
})
export class CreacionPerfilComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  perfil: Perfil = new Perfil();
  mensaje: string = '';
  id: number = 0;
  edicion: boolean = false;
  listservices: Services[] = [];
  listproveedores: Proveedor[] = [];
  maxFecha: string = new Date().toISOString().split('T')[0];

  constructor(
    private perfilService: PerfilService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private servicesService: ServicesService,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      perfilId: [''],
      service: ['', Validators.required],
      correo: ['', Validators.required],
      contrasena: ['', Validators.required],
      fechainicio: ['', Validators.required],
      fechafin: ['', Validators.required],
      limiteUsuarios: ['', [Validators.required, Validators.min(1)]],
      usuariosActuales: [0, Validators.required], // Inicializa en 0
      usuariosDisponibles: ['', Validators.required], // Inicializa con el mismo valor que limiteUsuarios
      proveedor: ['', Validators.required]
    });

    this.servicesService.list().subscribe(data => {
      this.listservices = data;
    });

    this.proveedorService.list().subscribe(data => {
      this.listproveedores = data;
    });

    this.form.get('limiteUsuarios')?.valueChanges.subscribe(value => {
      this.form.get('usuariosDisponibles')?.setValue(value);
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.perfil.perfilId = this.form.value.perfilId;
      this.perfil.service.serviceId = this.form.value.service;
      this.perfil.correo = this.form.value.correo;
      this.perfil.contrasena = this.form.value.contrasena;
      this.perfil.fechainicio = this.form.value.fechainicio;
      this.perfil.fechafin = this.form.value.fechafin;
      this.perfil.limiteUsuarios = this.form.value.limiteUsuarios;
      this.perfil.usuariosActuales = 0; // Inicializa en 0
      this.perfil.usuariosDisponibles = this.form.value.limiteUsuarios; // Igual a limiteUsuarios
      this.perfil.proveedor.proveedorId = this.form.value.proveedor;

      if (this.edicion) {
        this.perfilService.update(this.perfil).subscribe(() => {
          this.perfilService.list().subscribe(data => {
            this.perfilService.setList(data);
          });
        });
      } else {
        this.perfilService.insert(this.perfil).subscribe(() => {
          this.perfilService.list().subscribe(data => {
            this.perfilService.setList(data);
          });
        });
      }
      this.router.navigate(['components/perfil']);
    } else {
      this.mensaje = 'Revise los campos!!!';
    }
  }

  init() {
    if (this.edicion) {
      this.perfilService.listId(this.id).subscribe(data => {
        this.form = this.formBuilder.group({
          perfilId: new FormControl(data.perfilId),
          service: new FormControl(data.service.serviceId),
          correo: new FormControl(data.correo),
          contrasena: new FormControl(data.contrasena),
          fechainicio: new FormControl(data.fechainicio),
          fechafin: new FormControl(data.fechafin),
          limiteUsuarios: new FormControl(data.limiteUsuarios),
          usuariosActuales: new FormControl(data.usuariosActuales),
          usuariosDisponibles: new FormControl(data.usuariosDisponibles),
          proveedor: new FormControl(data.proveedor.proveedorId)
        });
      });
    }
  }
}
