import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Services } from 'src/app/model/Services';
import { ServicesService } from 'src/app/service/services.service';

@Component({
  selector: 'app-creacion-servicio',
  templateUrl: './creacion-servicio.component.html',
  styleUrls: ['./creacion-servicio.component.css']
})
export class CreacionServicioComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  services: Services = new Services();
  mensaje: string = '';
  @Input() id: number | null = null;
  @Output() cerrarFormulario = new EventEmitter<void>();
  edicion: boolean = false;

  constructor(
    private cS: ServicesService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      serviceId: [''],
      service: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(150)]],
    });

    if (this.id !== null) {
      this.edicion = true;
      this.init();
    } else {
      this.edicion = false;
    }
  }

  aceptar() {
    if (this.form.valid) {
      this.services.serviceId = this.form.value.serviceId;
      this.services.service = this.form.value.service;
      this.services.description = this.form.value.description;

      if (this.edicion) {
        this.cS.update(this.services).subscribe(() => {
          this.cS.list().subscribe(data => {
            this.cS.setList(data);
          });
          this.cerrarFormulario.emit();
        });
      } else {
        this.cS.insert(this.services).subscribe(() => {
          this.cS.list().subscribe(data => {
            this.cS.setList(data);
          });
          this.cerrarFormulario.emit();
        });
      }
    } else {
      this.mensaje = 'Revise los campos!!!';
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
    if (this.edicion && this.id !== null) {
      this.cS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          serviceId: new FormControl(data.serviceId),
          service: new FormControl(data.service, [Validators.required, Validators.maxLength(20)]),
          description: new FormControl(data.description, [Validators.required, Validators.maxLength(150)]),
        });
      });
    }
  }

  ocultarFormulario() {
    this.cerrarFormulario.emit();
  }
}
