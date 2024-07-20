import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Proveedor } from 'src/app/model/Proveedor';
import { ProveedorService } from 'src/app/service/proveedor-service.service';

@Component({
  selector: 'app-registro-proveedor',
  templateUrl: './registro-proveedor.component.html',
  styleUrls: ['./registro-proveedor.component.css']
})
export class RegistroProveedorComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  proveedor: Proveedor = new Proveedor();
  mensaje: string = '';
  @Input() id: number | null = null;
  @Output() cerrarFormulario = new EventEmitter<void>();
  edicion: boolean = false;

  constructor(
    private proveedorService: ProveedorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      proveedorId: [''],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });

    if (this.id !== null) {
      this.edicion = true;
      this.initForm(); // Llamada correcta al método initForm
    } else {
      this.edicion = false;
    }
  }

  aceptar(): void {
    if (this.form.valid) {
      this.proveedor.proveedorId = this.form.value.proveedorId;
      this.proveedor.nombre = this.form.value.nombre;

      if (this.edicion) {
        this.proveedorService.update(this.proveedor).subscribe(() => {
          this.actualizarLista();
          this.cerrarFormulario.emit();
        });
      } else {
        this.proveedorService.insert(this.proveedor).subscribe(() => {
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

  private initForm(): void { // Método correcto para inicializar el formulario
    if (this.edicion && this.id !== null) {
      this.proveedorService.listId(this.id).subscribe((data) => {
        this.form.patchValue({
          proveedorId: data.proveedorId,
          nombre: data.nombre,
        });
      });
    }
  }

  private actualizarLista(): void {
    this.proveedorService.list().subscribe((data) => {
      this.proveedorService.setList(data);
    });
  }

  ocultarFormulario() {
    this.cerrarFormulario.emit();
  }
}
