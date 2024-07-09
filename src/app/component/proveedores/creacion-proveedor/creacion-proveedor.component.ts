import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Proveedor } from 'src/app/model/Proveedor';
import { ProveedorService } from 'src/app/service/proveedor-service.service';

@Component({
  selector: 'app-creacion-proveedor',
  templateUrl: './creacion-proveedor.component.html',
  styleUrls: ['./creacion-proveedor.component.css']
})
export class CreacionProveedorComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  proveedor: Proveedor = new Proveedor();
  mensaje: string = '';
  id: number = 0;
  edicion: boolean = false;

  constructor(
    private proveedorService: ProveedorService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      proveedorId: [''],
      nombre: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.proveedor.proveedorId = this.form.value.proveedorId;
      this.proveedor.nombre = this.form.value.nombre;

      if (this.edicion) {
        this.proveedorService.update(this.proveedor).subscribe(() => {
          this.proveedorService.list().subscribe(data => {
            this.proveedorService.setList(data);
          });
        });
      } else {
        this.proveedorService.insert(this.proveedor).subscribe(() => {
          this.proveedorService.list().subscribe(data => {
            this.proveedorService.setList(data);
          });
        });
      }
      this.router.navigate(['components/proveedor']);
    } else {
      this.mensaje = 'Revise los campos!!!';
    }
  }

  init() {
    if (this.edicion) {
      this.proveedorService.listId(this.id).subscribe(data => {
        this.form = this.formBuilder.group({
          proveedorId: new FormControl(data.proveedorId),
          nombre: new FormControl(data.nombre, [Validators.required, Validators.maxLength(100)])
        });
      });
    }
  }
}
