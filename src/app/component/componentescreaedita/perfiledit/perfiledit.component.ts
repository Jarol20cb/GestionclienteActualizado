import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Perfil } from 'src/app/model/Perfil';
import { Proveedor } from 'src/app/model/Proveedor';
import { Services } from 'src/app/model/Services';
import { PerfilService } from 'src/app/service/perfil-service.service';
import { ProveedorService } from 'src/app/service/proveedor-service.service';
import { ServicesService } from 'src/app/service/services.service';

@Component({
  selector: 'app-perfiledit',
  templateUrl: './perfiledit.component.html',
  styleUrls: ['./perfiledit.component.css']
})
export class PerfileditComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  perfil: Perfil = new Perfil();
  mensaje: string = '';
  id: number | null = null;
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
    private proveedorService: ProveedorService,
    private snackBar: MatSnackBar
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

    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      if (id) {
        this.edicion = true;
        this.id = id;
        this.init(this.id);
      } else {
        this.edicion = false;
      }
    });

    this.servicesService.list().subscribe(data => {
      this.listservices = data;
      if (this.listservices.length === 0) {
        this.form.get('service')?.setValue('');
      }
    });

    this.proveedorService.list().subscribe(data => {
      this.listproveedores = data;
      if (this.listproveedores.length === 0) {
        this.form.get('proveedor')?.setValue('');
      }
    });

    this.form.get('limiteUsuarios')?.valueChanges.subscribe(value => {
      const usuariosActuales = this.form.get('usuariosActuales')?.value || 0;
      this.form.get('usuariosDisponibles')?.setValue(value - usuariosActuales);
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.perfil.perfilId = this.form.value.perfilId;
      this.perfil.service.serviceId = this.form.value.service;
      this.perfil.correo = this.form.value.correo;
      this.perfil.contrasena = this.form.value.contrasena;
      this.perfil.fechainicio = this.form.value.fechainicio;
      this.perfil.fechafin = this.form.value.fechafin;
      this.perfil.limiteUsuarios = this.form.value.limiteUsuarios;
      this.perfil.usuariosActuales = this.form.value.usuariosActuales;
      this.perfil.usuariosDisponibles = this.form.value.usuariosDisponibles;
      this.perfil.proveedor.proveedorId = this.form.value.proveedor;

      if (this.edicion) {
        this.perfilService.update(this.perfil).subscribe(() => {
          this.perfilService.list().subscribe(data => {
            this.perfilService.setList(data);
            this.router.navigate(['/components/perfil-overview']);
          });
          this.showNotification(`Se ha actualizado el registro del perfil ${this.perfil.correo}`);
        });
      } else {
        this.perfilService.insert(this.perfil).subscribe(() => {
          this.perfilService.list().subscribe(data => {
            this.perfilService.setList(data);
            this.router.navigate(['/components/perfil-overview']);
          });
          this.showNotification(`Se ha registrado correctamente el perfil ${this.perfil.correo}`);
        });
      }
    } else {
      this.mensaje = 'Revise los campos!!!';
    }
  }

  init(id: number): void {
    this.perfilService.listId(id).subscribe(data => {
      this.perfil = data;
      this.form.patchValue({
        perfilId: data.perfilId,
        service: data.service.serviceId,
        correo: data.correo,
        contrasena: data.contrasena,
        fechainicio: this.formatDate(data.fechainicio),
        fechafin: this.formatDate(data.fechafin),
        limiteUsuarios: data.limiteUsuarios,
        usuariosActuales: data.usuariosActuales,
        usuariosDisponibles: data.usuariosDisponibles,
        proveedor: data.proveedor.proveedorId
      });
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = new Date(this.form.get('fechainicio')?.value);
    const endDate = new Date(control.value);
    if (endDate < startDate) {
      return { invalidDate: true };
    }
    return null;
  }

  obtenerControlCampo(nombreCampo: string): AbstractControl {
    return this.form.get(nombreCampo) as AbstractControl;
  }

  showNotification(message: string) {
    this.snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  cancelar(): void {
    if (this.id !== null) {
      this.router.navigate(['/components/perfil-detail', this.id]);
    } else {
      this.router.navigate(['/components/perfil-overview']);
    }
  }

  navigateToCreateService() {
    this.router.navigate(['/components/servicios-overview']);
  }

  navigateToCreateProveedor() {
    this.router.navigate(['/components/proveedor']);
  }
}
