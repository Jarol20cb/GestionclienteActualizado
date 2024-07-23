import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Socio } from 'src/app/model/socio';
import { SocioService } from 'src/app/service/socio.service';

@Component({
  selector: 'app-socioedit',
  templateUrl: './socioedit.component.html',
  styleUrls: ['./socioedit.component.css']
})
export class SocioeditComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  socio: Socio = new Socio();
  mensaje: string = '';
  id: number | null = null;
  edicion: boolean = false;

  constructor(
    private socioService: SocioService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      socioId: [''],
      name: ['', [Validators.required, Validators.maxLength(40)]]
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
      this.socio.socioId = this.form.value.socioId;
      this.socio.name = this.form.value.name;

      if (this.edicion) {
        this.socioService.update(this.socio).subscribe(() => {
          this.socioService.list().subscribe(data => {
            this.socioService.setList(data);
            this.router.navigate(['/components/socio-overview']);
          });
          this.showNotification(`Se ha actualizado el registro de ${this.socio.name}`);
        });
      } else {
        this.socioService.insert(this.socio).subscribe(() => {
          this.socioService.list().subscribe(data => {
            this.socioService.setList(data);
            this.router.navigate(['/components/socio-overview']);
          });
          this.showNotification(`Se ha registrado correctamente a ${this.socio.name}`);
        });
      }
    } else {
      this.mensaje = 'Revise los campos!!!';
    }
  }

  init(id: number): void {
    this.socioService.listId(id).subscribe(data => {
      this.socio = data;
      this.form.patchValue({
        socioId: data.socioId,
        name: data.name
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
