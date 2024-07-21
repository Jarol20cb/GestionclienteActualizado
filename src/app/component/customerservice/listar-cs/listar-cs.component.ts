import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/service/login.service';
import { ConfirmDialogComponent } from '../../dialogo/confirm-dialog-component/confirm-dialog-component.component';
import { ConfirmarRenovacionDialogComponent } from '../../confirmar-renovacion-dialog/confirmar-renovacion-dialog.component';
import * as moment from 'moment';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CustomersServices } from 'src/app/model/CustomerService';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

// Define los estilos
const centeredStyle = {
  alignment: { vertical: 'center', horizontal: 'center' },
  border: {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } }
  }
};

@Component({
  selector: 'app-listar-cs',
  templateUrl: './listar-cs.component.html',
  styleUrls: ['./listar-cs.component.css']
})
export class ListarCsComponent implements OnInit {
  dataSource: CustomersServices[] = [];
  originalDataSource: CustomersServices[] = [];
  displayedColumns: string[] = ['clientes', 'servicio', 'perfil', 'fechainicio', 'fechafin', 'estado', 'socio', 'cambiarEstado', 'editar', 'eliminar'];
  role: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: CustomersServices[] = [];

  mostrarFormularioRegistro: boolean = false;
  idEdicion: number | null = null;

  constructor(private cS: CustomerserviceService, public dialog: MatDialog, private loginService: LoginService) {}

  ngOnInit(): void {
    this.role = this.loginService.showRole();
    this.actualizarColumnas();
    this.cS.list().subscribe((data) => {
      data.forEach(this.checkAndUpdateEstado.bind(this));
      data.sort((a, b) => this.ordenarEstados(a, b));
      this.originalDataSource = data; // Guardar los datos originales
      this.dataSource = data;
      this.totalItems = data.length;
      this.paginarDatos();
    });
    this.cS.getList().subscribe((data) => {
      data.forEach(this.checkAndUpdateEstado.bind(this));
      data.sort((a, b) => this.ordenarEstados(a, b));
      this.originalDataSource = data; // Guardar los datos originales
      this.dataSource = data;
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  mostrarFormulario() {
    this.mostrarFormularioRegistro = true;
    this.idEdicion = null;
  }

  ocultarFormulario() {
    this.mostrarFormularioRegistro = false;
  }

  cerrarFormulario() {
    this.ocultarFormulario();
  }

  editarClienteServicio(id: number) {
    this.mostrarFormularioRegistro = true;
    this.idEdicion = id;
  }

  verificar(): boolean {
    return this.loginService.verificar();
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cS.delete(id).subscribe(() => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
            this.originalDataSource = data; // Guardar los datos originales
            this.dataSource = data;
            this.totalItems = data.length;
            this.paginarDatos();
          });
        });
      }
    });
  }

  cambiarEstado(element: CustomersServices) {
    const dialogRef = this.dialog.open(ConfirmarRenovacionDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (element.estado === 'pendiente') {
          element.estado = 'cancelado';
          const startDate = new Date(element.fechafin);
          const endDate = new Date(startDate);
          startDate.setMonth(startDate.getMonth());
          endDate.setMonth(startDate.getMonth() + 1);

          element.fechainicio = startDate;
          element.fechafin = endDate;

          this.cS.update(element).subscribe(() => {
            this.cS.list().subscribe((data) => {
              data.forEach(this.checkAndUpdateEstado.bind(this));
              data.sort((a, b) => this.ordenarEstados(a, b));
              this.originalDataSource = data; // Guardar los datos originales
              this.dataSource = data;
              this.totalItems = data.length;
              this.paginarDatos();
            });
          });
        } else {
          alert('El estado no se puede cambiar porque ya está actualizado.');
        }
      }
    });
  }

  filter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource = this.originalDataSource.filter(cs => // Usar originalDataSource para filtrar
      cs.name.toLowerCase().includes(filterValue) || 
      cs.services.service.toLowerCase().includes(filterValue) ||
      cs.perfil.correo.toLowerCase().includes(filterValue) || 
      cs.socio.name.toLowerCase().includes(filterValue)
    );
    this.totalItems = this.dataSource.length;
    this.currentPage = 1;
    this.paginarDatos();
  }

  isOverdue(customerService: CustomersServices): boolean {
    const today = moment();
    const endDate = moment(customerService.fechafin);
    return endDate.isBefore(today) && customerService.estado !== 'cancelado';
  }

  ordenarEstados(a: CustomersServices, b: CustomersServices): number {
    if (a.estado === 'pendiente' && b.estado !== 'pendiente') {
      return -1;
    } else if (a.estado !== 'pendiente' && b.estado === 'pendiente') {
      return 1;
    } else if (a.estado === 'fiado' && b.estado !== 'fiado') {
      return -1;
    } else if (a.estado !== 'fiado' && b.estado === 'fiado') {
      return 1;
    } else {
      return 0;
    }
  }

  actualizarColumnas() {
    if (this.role === 'ADMIN') {
      this.displayedColumns = ['clientes', 'servicio', 'perfil', 'fechainicio', 'fechafin', 'estado', 'socio', 'cambiarEstado', 'editar', 'eliminar'];
    }
    if(this.role === 'CUSTOMER'){
      this.displayedColumns = ['clientes', 'servicio', 'perfil', 'fechainicio', 'fechafin', 'estado', 'socio', 'cambiarEstado', 'editar', 'eliminar'];
    }
  }

  changePageSize(event: any) {
    this.itemsPerPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.paginarDatos();
  }

  paginarDatos() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.dataSource.slice(start, end);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.paginarDatos();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginarDatos();
    }
  }

  checkAndUpdateEstado(element: CustomersServices) {
    const today = new Date();
    const endDate = new Date(element.fechafin);
    const oneMonthAfterStart = new Date(element.fechainicio);
    oneMonthAfterStart.setMonth(oneMonthAfterStart.getMonth() + 1);

    if (today > oneMonthAfterStart && element.estado === 'cancelado') {
      element.estado = 'pendiente';
      this.cS.update(element).subscribe(() => {
        this.cS.list().subscribe((data) => {
          data.sort((a, b) => this.ordenarEstados(a, b));
          this.originalDataSource = data; // Guardar los datos originales
          this.dataSource = data;
          this.totalItems = data.length;
          this.paginarDatos();
        });
      });
    }
  }

  getRowColor(element: CustomersServices): string {
    if (element.estado === 'pendiente') {
      return 'rgba(255, 0, 0, 0.3)';
    } else if (element.estado === 'cancelado') {
      return 'rgba(0, 128, 0, 0.1)';
    } else if (element.estado === 'fiado') {
      return 'rgba(255, 165, 0, 0.3)';
    } else {
      return '';
    }
  }

  getEstadoColor(element: CustomersServices): string {
    if (element.estado === 'pendiente') {
      return 'red';
    } else if (element.estado === 'cancelado') {
      return 'green';
    } else if (element.estado === 'fiado') {
      return 'orange';
    } else {
      return '';
    }
  }

  exportToExcel() {
    const flattenedData = this.dataSource.map(item => ({
      'Cliente': item.name,
      'Tipo de servicio': item.services?.service,
      'Perfil': item.perfil?.correo,
      'Socio': item.socio?.name,
      'Fecha de Inicio': moment(item.fechainicio).format('DD/MM/YYYY'),
      'Fecha de pagos': moment(item.fechafin).format('DD/MM/YYYY'),
      'Estado de la cuenta': item.estado
    }));
  
    // Crear el libro de trabajo y la hoja de trabajo
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  
    // Aplicar estilos de centrado y bordes de forma asincrónica
    setTimeout(() => {
      const range = XLSX.utils.decode_range(worksheet['!ref']!);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = { c: C, r: R };
          const cell_ref = XLSX.utils.encode_cell(cell_address);
          if (!worksheet[cell_ref]) continue;
          if (!worksheet[cell_ref].s) worksheet[cell_ref].s = {};
          worksheet[cell_ref].s = centeredStyle;
        }
      }
  
      // Convertir el libro de trabajo a un buffer
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'CustomerServices');
    }, 0);
  }
  
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
  
}
