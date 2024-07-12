import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Socio } from 'src/app/model/socio';
import { SocioService } from 'src/app/service/socio.service';

@Component({
  selector: 'app-creacion-socio',
  templateUrl: './creacion-socio.component.html',
  styleUrls: ['./creacion-socio.component.css']
})
export class CreacionSocioComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  socio: Socio = new Socio();
  mensaje: string = '';
  @Input() id: number | null = null;
  @Output() cerrarFormulario = new EventEmitter<void>();
  edicion: boolean = false;

  constructor(
    private socioService: SocioService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      socioId: [''],
      name: ['', [Validators.required, Validators.maxLength(40)]],
    });

    if (this.id !== null) {
      this.edicion = true;
      this.initForm();
    } else {
      this.edicion = false;
    }
  }

  aceptar(): void {
    if (this.form.valid) {
      this.socio.socioId = this.form.value.socioId;
      this.socio.name = this.form.value.name;

      if (this.edicion) {
        this.socioService.update(this.socio).subscribe(() => {
          this.actualizarLista();
          this.cerrarFormulario.emit();
        });
      } else {
        this.socioService.insert(this.socio).subscribe(() => {
          this.actualizarLista();
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

  private initForm(): void {
    if (this.edicion && this.id !== null) {
      this.socioService.listId(this.id).subscribe((data) => {
        this.form.patchValue({
          socioId: data.socioId,
          name: data.name,
        });
      });
    }
  }

  private actualizarLista(): void {
    this.socioService.list().subscribe((data) => {
      this.socioService.setList(data);
    });
  }

  ocultarFormulario() {
    this.cerrarFormulario.emit();
  }
}
