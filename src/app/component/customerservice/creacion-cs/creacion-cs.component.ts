import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomersServices } from 'src/app/model/CustomerService';
import { Services } from 'src/app/model/Services';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { ServicesService } from 'src/app/service/services.service';
import * as moment from 'moment';
import { NotificationComponent } from '../../notification/notification.component';

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
  maxFecha: string = new Date().toISOString().split('T')[0];  // Set max date to today

  constructor(
    private cS: CustomerserviceService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private Ds: ServicesService,
    private snackBar: MatSnackBar  // Añadido MatSnackBar
  ) { }

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
      fechainicio: ['', [Validators.required, this.dateValidator.bind(this)]],
      fechafin: [{ value: '', disabled: true }, Validators.required],
      estado: [{ value: 'cancelado', disabled: true }]
    });

    this.form.get('fechainicio')?.valueChanges.subscribe(value => {
      if (value) {
        this.updateFechafin(value);
      }
    });

    this.Ds.list().subscribe(data => {
      this.listservices = data;
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
      const fechainicio = moment(this.form.value.fechainicio).toDate();
      this.customerservice.fechainicio = fechainicio;
      this.customerservice.fechafin = moment(this.form.get('fechafin')?.value).toDate();
      this.customerservice.estado = 'cancelado';  // Estado inicial como 'cancelado'
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

  updateFechafin(fechainicio: string) {
    const startDate = moment(fechainicio).startOf('day');
    const endDate = startDate.clone().add(1, 'month').endOf('day');
    this.form.get('fechafin')?.setValue(endDate.format('YYYY-MM-DD'));
    this.form.get('fechafin')?.disable();  // Ensure it stays disabled
  }

  updateEstadoAutomatico() {
    const today = moment();
    const endDate = moment(this.customerservice.fechafin);
    if (endDate.isBefore(today) && this.customerservice.estado !== 'cancelado') {
      this.customerservice.estado = 'pendiente';
    }
  }

  obtenerControlCampo(nombreCampo: string): AbstractControl {
    const control = this.form.get(nombreCampo);
    if (!control) {
      throw new Error(`Control no encontrado para el campo ${nombreCampo}`);
    }
    return control;
  }

  init() {
    if (this.edicion) {
      this.cS.listId(this.id).subscribe((data) => {
        this.customerservice = data;
        this.form = this.formBuilder.group({
          idcs: [data.idcs],
          name: [data.name, Validators.required],
          services: [data.services.serviceId, Validators.required],
          fechainicio: [this.formatDate(data.fechainicio), [Validators.required, this.dateValidator.bind(this)]],
          fechafin: [{ value: this.formatDate(data.fechafin), disabled: true }, Validators.required],
          estado: [{ value: data.estado, disabled: true }]
        });

        // Update the fechaFin based on the fechainicio when in edit mode
        this.form.get('fechainicio')?.valueChanges.subscribe(value => {
          if (value) {
            this.updateFechafin(value);
          }
        });

        // Update the fechaFin initially based on the fechainicio when in edit mode
        this.updateFechafin(this.form.value.fechainicio);
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
      duration: 50000,  // Duración cambiada a 3 segundos (3000 milisegundos)
      horizontalPosition: 'center',  // Posición horizontal
      verticalPosition: 'top',  // Posición vertical
    });
  }
  
}
