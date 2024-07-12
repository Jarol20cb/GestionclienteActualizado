import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() id: number | null = null;
  @Output() cerrarFormulario = new EventEmitter<void>();
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
    this.form = this.formBuilder.group({
      perfilId: [''],
      service: ['', Validators.required],
      correo: ['', Validators.required],
      contrasena: ['', Validators.required],
      fechainicio: ['', Validators.required],
      fechafin: ['', [Validators.required, this.dateValidator.bind(this)]],
      limiteUsuarios: ['', [Validators.required, Validators.min(1)]],
      usuariosActuales: [0, Validators.required],
      usuariosDisponibles: ['', Validators.required],
      proveedor: ['', Validators.required]
    });

    if (this.id !== null) {
      this.edicion = true;
      this.init();
    } else {
      this.edicion = false;
    }

    this.servicesService.list().subscribe(data => {
      this.listservices = data;
      this.form.get('service')?.setValue('');
    });

    this.proveedorService.list().subscribe(data => {
      this.listproveedores = data;
      this.form.get('proveedor')?.setValue('');
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
      this.perfil.usuariosActuales = 0;
      this.perfil.usuariosDisponibles = this.form.value.limiteUsuarios;
      this.perfil.proveedor.proveedorId = this.form.value.proveedor;

      if (this.edicion) {
        this.perfilService.update(this.perfil).subscribe(() => {
          this.perfilService.list().subscribe(data => {
            this.perfilService.setList(data);
            this.cerrarFormulario.emit();
          });
        });
      } else {
        this.perfilService.insert(this.perfil).subscribe(() => {
          this.perfilService.list().subscribe(data => {
            this.perfilService.setList(data);
          });
          this.cerrarFormulario.emit();
        });
      }
    } else {
      this.mensaje = 'Revise los campos!!!';
    }
  }

  init() {
    if (this.edicion && this.id !== null) {
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

  dateValidator(control: FormControl): { [key: string]: boolean } | null {
    const startDate = new Date(this.form.get('fechainicio')?.value);
    const endDate = new Date(control.value);
    if (endDate < startDate) {
      return { invalidDate: true };
    }
    return null;
  }

  ocultarFormulario() {
    this.cerrarFormulario.emit();
  }
}
