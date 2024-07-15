import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import * as moment from 'moment';
import { Socio } from 'src/app/model/socio';
import { SocioService } from 'src/app/service/socio.service';
import { CustomersServices } from 'src/app/model/CustomerService';
import { NotificationComponent } from 'src/app/component/notification/notification.component';

@Component({
  selector: 'app-crear-perfil-cliente',
  templateUrl: './crear-perfil-cliente.component.html',
  styleUrls: ['./crear-perfil-cliente.component.css']
})
export class CrearPerfilClienteComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  customerservice: CustomersServices = new CustomersServices();
  mensaje: string = '';
  @Output() cerrarFormulario = new EventEmitter<void>();
  listSocios: Socio[] = [];
  maxFecha: string = new Date().toISOString().split('T')[0];  // Set max date to today
  perfilId: number = 0;
  serviceId: number = 0;

  constructor(
    private cS: CustomerserviceService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private socioService: SocioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = +params['serviceId'];
      this.perfilId = +params['perfilId'];
    });

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(40)]],
      fechainicio: ['', [Validators.required, this.dateValidator.bind(this)]],
      paymentPeriod: [1, [Validators.required, Validators.min(1)]],
      fechafin: [{ value: '', disabled: true }, Validators.required],
      estado: ['cancelado', Validators.required],
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

    this.socioService.list().subscribe(data => {
      this.listSocios = data;
      if (this.listSocios.length === 0) {
        this.form.get('socio')?.setValue('');
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
      this.customerservice.name = this.form.value.name;
      this.customerservice.services.serviceId = this.serviceId;
      this.customerservice.perfil.perfilId = this.perfilId;
      const fechainicio = moment(this.form.value.fechainicio).toDate();
      this.customerservice.fechainicio = fechainicio;
      this.customerservice.fechafin = moment(this.form.get('fechafin')?.value).toDate();
      this.customerservice.estado = this.form.value.estado;
      this.customerservice.socio.socioId = this.form.value.socio;

      this.updateEstadoAutomatico();

      this.cS.insert(this.customerservice).subscribe(data => {
        this.cS.list().subscribe(data => {
          this.cS.setList(data);
        });
        this.cerrarFormulario.emit();
        this.showNotification(`Se ha registrado correctamente a ${this.customerservice.name}`);
      });
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

  ocultarFormulario() {
    this.cerrarFormulario.emit();
  }
}
