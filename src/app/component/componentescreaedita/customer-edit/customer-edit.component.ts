import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';
import { ServicesService } from 'src/app/service/services.service';
import { SocioService } from 'src/app/service/socio.service';
import { PerfilService } from 'src/app/service/perfil-service.service';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  customerservice: CustomersServices = new CustomersServices();
  mensaje: string = '';
  id: number | null = null;
  edicion: boolean = false;
  listservices: any[] = [];
  listsocios: any[] = [];
  listperfil: any[] = [];
  maxFecha: string = new Date().toISOString().split('T')[0];

  constructor(
    private cS: CustomerserviceService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private Ds: ServicesService,
    private socioService: SocioService,
    private perfilService: PerfilService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      idcs: [''],
      name: ['', [Validators.required, Validators.maxLength(40)]],
      services: ['', Validators.required],
      perfil: ['', Validators.required],
      fechainicio: ['', [Validators.required, this.dateValidator.bind(this)]],
      paymentPeriod: [1, [Validators.required, Validators.min(1)]],
      fechafin: [{ value: '', disabled: true }, Validators.required],
      estado: ['cancelado', Validators.required],
      socio: ['', Validators.required],
      numerocelular: ['', Validators.maxLength(15)] // Añadir validación para numerocelular
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

    this.form.get('services')?.valueChanges.subscribe(serviceId => {
      this.loadAvailablePerfiles(serviceId);
    });

    this.form.get('fechainicio')?.valueChanges.subscribe(value => {
      if (value && this.form.get('paymentPeriod')?.value) {
        this.updateFechafin(value, this.form.get('paymentPeriod')?.value);
      }
    });

    this.form.get('paymentPeriod')?.valueChanges.subscribe(value => {
      if (this.form.get('fechainicio')?.value && value) {
        this.updateFechafin(this.form.get('fechainicio')?.value, value);
      }
    });

    this.Ds.list().subscribe(data => {
      this.listservices = data;
      if (this.listservices.length === 0) {
        this.form.get('services')?.setValue('');
      }
    });

    this.socioService.list().subscribe(data => {
      this.listsocios = data;
      if (this.listsocios.length === 0) {
        this.form.get('socio')?.setValue('');
      }
    });

    if (this.edicion) {
      this.init(this.id!);
    }
  }

  loadAvailablePerfiles(serviceId: number) {
    this.perfilService.findAvailableByService(serviceId).subscribe(data => {
      this.listperfil = data;
      if (this.listperfil.length === 0) {
        this.form.get('perfil')?.setValue('');
      }
    });
  }

  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      return { 'invalidDate': true };
    }
    return null;
  }

  aceptar() {
    if (this.form.valid) {
      this.customerservice.idcs = this.form.value.idcs;
      this.customerservice.name = this.form.value.name;
      this.customerservice.services.serviceId = this.form.value.services;
      this.customerservice.perfil.perfilId = this.form.value.perfil;
      const fechainicio = moment(this.form.value.fechainicio).toDate();
      this.customerservice.fechainicio = fechainicio;
      this.customerservice.fechafin = moment(this.form.get('fechafin')?.value).toDate();
      this.customerservice.estado = this.form.value.estado;
      this.customerservice.socio.socioId = this.form.value.socio;
      this.customerservice.numerocelular = this.form.value.numerocelular; // Añadir numerocelular

      this.updateEstadoAutomatico();

      if (this.edicion) {
        this.cS.update(this.customerservice).subscribe(() => {
          this.cS.list().subscribe(data => {
            this.cS.setList(data);
            this.router.navigate(['/components/customer-overview']);
          });
          this.showNotification(`Se ha actualizado el registro de ${this.customerservice.name}`);
        });
      } else {
        this.cS.insert(this.customerservice).subscribe(data => {
          this.cS.list().subscribe(data => {
            this.cS.setList(data);
          });
          this.router.navigate(['/components/customer-overview']);
          this.showNotification(`Se ha registrado correctamente a ${this.customerservice.name}`);
        });
      }
    } else {
      this.mensaje = "Ingrese todos los campos!!!";
    }
  }

  updateFechafin(fechainicio: string, paymentPeriod: number) {
    const startDate = moment(fechainicio).startOf('day');
    const endDate = startDate.clone().add(paymentPeriod, 'months').endOf('day');
    this.form.get('fechafin')?.setValue(endDate.format('YYYY-MM-DD'));
    this.form.get('fechafin')?.disable();
  }

  updateEstadoAutomatico() {
    const today = moment();
    const endDate = moment(this.customerservice.fechafin);
    if (endDate.isBefore(today) && this.customerservice.estado !== 'cancelado') {
      this.customerservice.estado = 'pendiente';
    }
  }

  init(id: number) {
    this.cS.listId(id).subscribe((data) => {
      this.customerservice = data;

      // Cargar perfiles disponibles para el servicio actual
      this.loadAvailablePerfiles(data.services.serviceId);

      this.form.patchValue({
        idcs: data.idcs,
        name: data.name,
        services: data.services.serviceId,
        perfil: data.perfil.perfilId,
        fechainicio: this.formatDate(data.fechainicio),
        paymentPeriod: 1,
        fechafin: this.formatDate(data.fechafin),
        estado: data.estado,
        socio: data.socio ? data.socio.socioId : '',
        numerocelular: data.numerocelular // Añadir numerocelular
      });

      this.updateFechafin(this.form.value.fechainicio, this.form.value.paymentPeriod);
      this.updateEstadoAutomatico();
    });
  }

  formatDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }

  showNotification(message: string) {
    this.snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // Implementar los métodos incrementMonths y decrementMonths
  incrementMonths() {
    const currentValue = this.form.get('paymentPeriod')?.value;
    this.form.get('paymentPeriod')?.setValue(currentValue + 1);
    this.updateFechafin(this.form.get('fechainicio')?.value, currentValue + 1);
  }

  decrementMonths() {
    const currentValue = this.form.get('paymentPeriod')?.value;
    if (currentValue > 1) {
      this.form.get('paymentPeriod')?.setValue(currentValue - 1);
      this.updateFechafin(this.form.get('fechainicio')?.value, currentValue - 1);
    }
  }

  obtenerControlCampo(nombreCampo: string): AbstractControl {
    const control = this.form.get(nombreCampo);
    if (!control) {
      throw new Error(`Control no encontrado para el campo ${nombreCampo}`);
    }
    return control;
  }

  cancelar(): void {
    if (this.id !== null) {
      this.router.navigate(['/components/customer-detail', this.id]);
    } else {
      this.router.navigate(['/components/customer-overview']);
    }
  }
}
