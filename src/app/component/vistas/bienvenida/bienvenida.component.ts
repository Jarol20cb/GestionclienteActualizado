import { Component, OnInit, HostListener, AfterViewChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';
import { Registro } from 'src/app/model/registro';
import { PerfilService } from 'src/app/service/perfil-service.service'; // Importa el servicio de perfiles

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit, AfterViewChecked {
  user: Registro = new Registro();
  totalUsuarios: number = 0;
  usuariosDeudores: number = 0;
  totalPerfiles = 3;
  usuariosActualesPerfiles = 3;
  usuariosDisponiblesPerfiles = 9;
  isSidebarCollapsed = true; // Por defecto, la barra lateral está cerrada en modo responsive
  isMobile = false;
  clientesPendientes: CustomersServices[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  error: string = "";
  popularPlatforms: any[] = []; // Nueva variable para almacenar los datos de las plataformas más populares
  isChartRendered: boolean = false;

  constructor(
    private loginService: LoginService, 
    private dialog: MatDialog, 
    private cS: CustomerserviceService, 
    private router: Router,
    private perfilService: PerfilService // Inyecta el servicio de perfiles
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
    this.cargarClientesPendientes();
    this.cargarEstadisticas();
    this.cargarPlataformasPopulares(); // Cargar datos de plataformas populares
    this.checkWindowSize();
  }

  ngAfterViewChecked() {
    if (this.popularPlatforms.length > 0 && !this.isChartRendered) {
      this.renderPopularPlatformsChart();
      this.isChartRendered = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowSize();
  }

  checkWindowSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isSidebarCollapsed = true;
    } else {
      this.isSidebarCollapsed = false;
    }
  }

  loadUserDetails() {
    this.loginService.getUserDetails().subscribe(
      data => {
        this.user = data;
      },
      error => {
        this.error = error;
        console.error('Error al obtener los detalles del usuario', error);
      }
    );
  }

  cargarClientesPendientes() {
    this.cS.list().subscribe((data) => {
      this.clientesPendientes = data.filter(cliente => cliente.estado === 'pendiente');
    });
  }

  get paginatedClientes() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.clientesPendientes.slice(start, end);
  }

  nextPage() {
    this.currentPage++;
  }

  previousPage() {
    this.currentPage--;
  }

  cargarEstadisticas() {
    this.cS.list().subscribe((data) => {
      this.totalUsuarios = data.length;
      this.usuariosDeudores = data.filter(cliente => cliente.estado === 'pendiente').length;
    });
  }

  cargarPlataformasPopulares() {
    this.perfilService.list().subscribe((data) => {
      const platformUsage = data.reduce((acc: any, perfil: any) => {
        const serviceName = perfil.service.service;
        if (!acc[serviceName]) {
          acc[serviceName] = 0;
        }
        acc[serviceName]++;
        return acc;
      }, {});

      this.popularPlatforms = Object.keys(platformUsage).map(key => ({
        name: key,
        usageCount: platformUsage[key]
      })).sort((a, b) => b.usageCount - a.usageCount).slice(0, 4); // Limitar a 4 plataformas
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  verPerfil() {
    this.router.navigate(['/components/credentials']);
  }

  renderPopularPlatformsChart() {
    const canvas = document.getElementById('popularPlatformsChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const labels = this.popularPlatforms.map(platform => platform.name);
    const data = this.popularPlatforms.map(platform => platform.usageCount);
    const barWidth = 40;
    const barSpacing = 50;
    const maxBarHeight = 200;
  
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous content if any
  
      if (data.length === 0) {
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Aún no hay datos para mostrar', canvas.width / 2, canvas.height / 2);
        return;
      }
  
      const maxUsageCount = Math.max(...data);
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']; // Colores diferentes para las barras
  
      const bars = data.map((usageCount, index) => {
        const barHeight = (usageCount / maxUsageCount) * maxBarHeight;
        const x = (index * (barWidth + barSpacing)) + barSpacing;
        const y = canvas.height - barHeight - 30; // Añadir más espacio para las etiquetas de texto
  
        // Dibujar barra
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(x, y, barWidth, barHeight);
  
        // Dibujar borde de la barra
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x, y, barWidth, barHeight);
  
        // Ajustar los nombres largos
        ctx.fillStyle = '#000'; // Color del texto negro
        ctx.textAlign = 'center'; // Alinear texto al centro de la barra
  
        const words = labels[index].split(' ');
        let labelY = canvas.height - 10;
        words.forEach((word: string) => {
          ctx.fillText(word, x + barWidth / 2, labelY);
          labelY += 12;
        });
  
        return { x, y, width: barWidth, height: barHeight, label: labels[index], count: usageCount };
      });
  
      canvas.onmousemove = (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
  
        // Redraw bars and labels
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        bars.forEach(bar => {
          ctx.fillStyle = colors[labels.indexOf(bar.label) % colors.length];
          ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
          ctx.strokeStyle = '#333';
          ctx.strokeRect(bar.x, bar.y, bar.width, bar.height);
  
          const words = bar.label.split(' ');
          let labelY = canvas.height - 10;
          words.forEach((word: string) => {
            ctx.fillStyle = '#000'; // Color del texto negro
            ctx.textAlign = 'center'; // Alinear texto al centro de la barra
            ctx.fillText(word, bar.x + bar.width / 2, labelY);
            labelY += 12;
          });
        });
  
        bars.forEach(bar => {
          if (x >= bar.x && x <= bar.x + bar.width && y <= canvas.height && y >= canvas.height - bar.height - 30) {
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${bar.label}: ${bar.count}`, bar.x + bar.width / 2, bar.y - 10);
          }
        });
      };
    }
  }
  

  
}
