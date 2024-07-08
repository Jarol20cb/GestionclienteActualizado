import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Services } from 'src/app/model/Services';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { ServicesService } from 'src/app/service/services.service';
import * as moment from 'moment';
import { NotificationComponent } from '../../notification/notification.component';
import { Socio } from 'src/app/model/socio';
import { SocioService } from 'src/app/service/socio.service';
import { Perfil } from 'src/app/model/Perfil';
import { CustomersServices } from 'src/app/model/CustomerService';
import { PerfilService } from 'src/app/service/perfil-service.service';

@Component({
  selector: 'app-creacion-cs',
  templateUrl: './creacion-cs.component.html',
  styleUrls: ['./creacion-cs.component.css']
})
export class CreacionCsComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  customerservice: CustomersServices = new CustomersServices();
  mensaje: string = '';
  id: number = 0;
  edicion: boolean = false;
  listservices: Services[] = [];
  listsocios: Socio[] = [];
  listperfil: Perfil[] = [];
  maxFecha: string = new Date().toISOString().split('T')[0];  // Set max date to today

  constructor(
    private cS: CustomerserviceService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private Ds: ServicesService,
    private socioService: SocioService,
    private perfilService: PerfilService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      idcs: [''],
      name: ['', [Validators.required, Validators.maxLength(15)]],
      services: ['', Validators.required],
      perfil: ['', Validators.required],
      fechainicio: ['', [Validators.required, this.dateValidator.bind(this)]],
      paymentPeriod: [1, [Validators.required, Validators.min(1)]],
      fechafin: [{ value: '', disabled: true }, Validators.required],
      estado: [{ value: 'cancelado', disabled: true }],
      socio: ['', Validators.required]
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
    });

    this.socioService.list().subscribe(data => {
      this.listsocios = data;
    });

    this.perfilService.list().subscribe(data => {
      this.listperfil = data;
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
      this.customerservice.estado = 'cancelado';
      this.customerservice.socio.socioId = this.form.value.socio;

      this.updateEstadoAutomatico();

      if (this.edicion) {
        this.cS.update(this.customerservice).subscribe(() => {
          this.cS.list().subscribe(data => {
            this.cS.setList(data);
          });
          this.showNotification(`Se ha actualizado el registro de ${this.customerservice.name}`);
        });
      } else {
        this.cS.insert(this.customerservice).subscribe(data => {
          this.cS.list().subscribe(data => {
            this.cS.setList(data);
          });
          this.showNotification(`Se ha registrado correctamente a ${this.customerservice.name}`);
        });
      }
      this.router.navigate(['components/custser']);
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

  init() {
    if (this.edicion) {
      this.cS.listId(this.id).subscribe((data) => {
        this.customerservice = data;
        this.form = this.formBuilder.group({
          idcs: [data.idcs],
          name: [data.name, Validators.required],
          services: [data.services.serviceId, Validators.required],
          perfil: [data.perfil.perfilId, Validators.required],
          fechainicio: [this.formatDate(data.fechainicio), [Validators.required, this.dateValidator.bind(this)]],
          paymentPeriod: [1, [Validators.required, Validators.min(1)]],
          fechafin: [{ value: this.formatDate(data.fechafin), disabled: true }, Validators.required],
          estado: [{ value: data.estado, disabled: true }],
          socio: [data.socio ? data.socio.socioId : '', Validators.required]
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

        this.updateFechafin(this.form.value.fechainicio, this.form.value.paymentPeriod);
        this.updateEstadoAutomatico();
      });
    }
  }

  formatDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }

  showNotification(message: string) {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: { message },
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  obtenerControlCampo(nombreCampo: string): AbstractControl {
    const control = this.form.get(nombreCampo);
    if (!control) {
      throw new Error(`Control no encontrado para el campo ${nombreCampo}`);
    }
    return control;
  }

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
}
