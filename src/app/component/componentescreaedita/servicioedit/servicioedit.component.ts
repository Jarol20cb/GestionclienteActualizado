import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Services } from 'src/app/model/Services';
import { ServicesService } from 'src/app/service/services.service';

@Component({
  selector: 'app-servicioedit',
  templateUrl: './servicioedit.component.html',
  styleUrls: ['./servicioedit.component.css']
})
export class ServicioeditComponent implements OnInit{

  form: FormGroup = new FormGroup({});
  services: Services = new Services();
  mensaje: string = '';
  id: number | null = null;
  edicion: boolean = false;

  constructor(
    private cS: ServicesService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      serviceId: [''],
      service: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(150)]]
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
  }

  aceptar(): void {
    if (this.form.valid) {
      this.services.serviceId = this.form.value.serviceId;
      this.services.service = this.form.value.service;
      this.services.description = this.form.value.description;

      if (this.edicion) {
        this.cS.update(this.services).subscribe(() => {
          this.cS.list().subscribe(data => {
            this.cS.setList(data);
            this.router.navigate(['/components/servicio-overview']);
          });
          this.showNotification(`Se ha actualizado el registro de ${this.services.service}`);
        });
      } else {
        this.cS.insert(this.services).subscribe(() => {
          this.cS.list().subscribe(data => {
            this.cS.setList(data);
            this.router.navigate(['/components/servicio-overview']);
          });
          this.showNotification(`Se ha registrado correctamente a ${this.services.service}`);
        });
      }
    } else {
      this.mensaje = 'Revise los campos!!!';
    }
  }

  init(id: number): void {
    this.cS.listId(id).subscribe(data => {
      this.services = data;
      this.form.patchValue({
        serviceId: data.serviceId,
        service: data.service,
        description: data.description
      });
    });
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

}
