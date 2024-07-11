import { Component, OnInit } from '@angular/core';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CustomersServices } from 'src/app/model/CustomerService';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {

  constructor(private customerService: CustomerserviceService) { 
    // Registra todos los componentes de Chart.js
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.renderCharts();
  }

  async fetchCustomerServiceData(): Promise<CustomersServices[]> {
    try {
      const data: CustomersServices[] = await this.customerService.list().toPromise() || [];
      console.log('Datos obtenidos de la API:', data); // Log para depuración
      return data;
    } catch (error) {
      console.error('Error al obtener datos de la API', error);
      return [];
    }
  }

  async renderCharts() {
    const data = await this.fetchCustomerServiceData();
    if (data.length === 0) {
      console.warn('No se encontraron datos en la API');
      return;
    }

    console.log('Datos procesados:', data); // Log para depuración

    const labels = data.map(item => item.name);
    const servicios = data.map(item => item.services.service.length); // Ajusta según el campo real de tu data
    const usuarios = data.map(item => item.perfil.correo.length); // Ajusta según el campo real de tu data

    // Calcular la distribución de estados
    const estados = data.map(item => item.estado);
    const estadoCounts: { [key: string]: number } = estados.reduce((acc: { [key: string]: number }, estado: string) => {
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});

    // Verifica los datos antes de renderizar los gráficos
    console.log('Labels:', labels);
    console.log('Servicios:', servicios);
    console.log('Usuarios:', usuarios);
    console.log('Estados:', estadoCounts);

    // Datos para el gráfico de barras
    const barData = {
      labels: labels,
      datasets: [{
        label: 'Cantidad de Servicios',
        data: servicios,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };

    // Configuración para el gráfico de barras
    const barConfig: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: barData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Servicios'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Clientes'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Servicios por Cliente'
          }
        }
      }
    };

    // Renderiza el gráfico de barras
    const barCtx = document.getElementById('barChart') as HTMLCanvasElement;
    if (barCtx) {
      new Chart(barCtx, barConfig);
    } else {
      console.error('No se encontró el elemento barChart');
    }

    // Datos para el gráfico de líneas
    const lineData = {
      labels: labels,
      datasets: [{
        label: 'Número de Usuarios',
        data: usuarios,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    // Configuración para el gráfico de líneas
    const lineConfig: ChartConfiguration<'line'> = {
      type: 'line',
      data: lineData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Usuarios'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Clientes'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Usuarios por Cliente'
          }
        }
      }
    };

    // Renderiza el gráfico de líneas
    const lineCtx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (lineCtx) {
      new Chart(lineCtx, lineConfig);
    } else {
      console.error('No se encontró el elemento lineChart');
    }

    // Datos para el gráfico circular (pie chart)
    const pieData = {
      labels: Object.keys(estadoCounts),
      datasets: [{
        label: 'Distribución de Estados',
        data: Object.values(estadoCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }]
    };

    // Configuración para el gráfico circular
    const pieConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: pieData,
      options: {
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Distribución de Estados'
          }
        }
      }
    };

    // Renderiza el gráfico circular
    const pieCtx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (pieCtx) {
      new Chart(pieCtx, pieConfig);
    } else {
      console.error('No se encontró el elemento pieChart');
    }
  }
}
