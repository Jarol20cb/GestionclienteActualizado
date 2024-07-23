import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Proveedor } from 'src/app/model/Proveedor';
import { ProveedorService } from 'src/app/service/proveedor-service.service';

@Component({
  selector: 'app-proveedoredit',
  templateUrl: './proveedoredit.component.html',
  styleUrls: ['./proveedoredit.component.css']
})
export class ProveedoreditComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  proveedor: Proveedor = new Proveedor();
  mensaje: string = '';
  id: number | null = null;
  edicion: boolean = false;

  constructor(
    private proveedorService: ProveedorService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      proveedorId: [''],
      nombre: ['', [Validators.required, Validators.maxLength(100)]]
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
      this.proveedor.proveedorId = this.form.value.proveedorId;
      this.proveedor.nombre = this.form.value.nombre;

      if (this.edicion) {
        this.proveedorService.update(this.proveedor).subscribe(() => {
          this.proveedorService.list().subscribe(data => {
            this.proveedorService.setList(data);
            this.router.navigate(['/components/proveedor-overview']);
          });
          this.showNotification(`Se ha actualizado el registro de ${this.proveedor.nombre}`);
        });
      } else {
        this.proveedorService.insert(this.proveedor).subscribe(() => {
          this.proveedorService.list().subscribe(data => {
            this.proveedorService.setList(data);
            this.router.navigate(['/components/proveedor-overview']);
          });
          this.showNotification(`Se ha registrado correctamente a ${this.proveedor.nombre}`);
        });
      }
    } else {
      this.mensaje = 'Revise los campos!!!';
    }
  }

  init(id: number): void {
    this.proveedorService.listId(id).subscribe(data => {
      this.proveedor = data;
      this.form.patchValue({
        proveedorId: data.proveedorId,
        nombre: data.nombre
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
