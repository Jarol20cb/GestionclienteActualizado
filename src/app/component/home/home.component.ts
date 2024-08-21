import { AfterViewChecked, Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/service/login.service';
import { CustomerserviceService } from 'src/app/service/customerservice.service';
import { CustomersServices } from 'src/app/model/CustomerService';
import { Registro } from 'src/app/model/registro';
import { Router } from '@angular/router';
import { PerfilService } from 'src/app/service/perfil-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  user: Registro = new Registro();
  totalUsuarios: number = 0;
  usuariosDeudores: number = 0;
  usuariosDisponiblesPerfiles: number = 0;
  isMobile = false;
  clientesPendientes: CustomersServices[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  error: string = "";
  popularPlatforms: any[] = [];
  isChartRendered: boolean = false;

  constructor(
    private loginService: LoginService, 
    private dialog: MatDialog, 
    private cS: CustomerserviceService, 
    private router: Router,
    private perfilService: PerfilService
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
    this.cargarClientesPendientes();
    this.cargarEstadisticas();
    this.cargarPlataformasPopulares();
    this.perfilService.list().subscribe((data) => {
      this.usuariosDisponiblesPerfiles = data.reduce((total, perfil) => {
        return total + perfil.usuariosDisponibles;
      }, 0);
    });
  }

  ngAfterViewChecked() {
    if (this.popularPlatforms.length > 0 && !this.isChartRendered) {
      this.renderPopularPlatformsChart();
      this.isChartRendered = true;
    }
  }
  loadUserDetails() {
    this.loginService.getUserDetails().subscribe(
      data => {
        this.user = data;
      },
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
      })).sort((a, b) => b.usageCount - a.usageCount).slice(0, 4);
    });
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
    const lineHeight = 12;
    const maxLabelWidth = barWidth + barSpacing;
  
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      if (data.length === 0) {
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Aún no hay datos para mostrar', canvas.width / 2, canvas.height / 2);
        return;
      }
  
      const maxUsageCount = Math.max(...data);
      const colors = ['#E57373', '#81C784', '#64B5F6', '#FFD54F'];
  
      const bars = data.map((usageCount, index) => {
        const barHeight = (usageCount / maxUsageCount) * maxBarHeight;
        const x = (index * (barWidth + barSpacing)) + barSpacing;
        const y = canvas.height - barHeight - 30;
  
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x, y, barWidth, barHeight);
  
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
  
        const words = labels[index].split(' ');
        const lines: string[] = [];
        let line = '';
  
        words.forEach((word: string) => {
          const testLine = line + word + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
  
          if (testWidth > maxLabelWidth && line !== '') {
            lines.push(line);
            line = word + ' ';
          } else {
            line = testLine;
          }
        });
  
        lines.push(line);
  
        let labelY = canvas.height - 10;
        lines.forEach((line: string) => {
          ctx.fillText(line, x + barWidth / 2, labelY);
          labelY += lineHeight;
        });
  
        return { x, y, width: barWidth, height: barHeight, label: labels[index], count: usageCount };
      });
  
      canvas.onmousemove = (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        bars.forEach(bar => {
          ctx.fillStyle = colors[labels.indexOf(bar.label) % colors.length];
          ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
          ctx.strokeStyle = '#333';
          ctx.strokeRect(bar.x, bar.y, bar.width, bar.height);
  
          const words = bar.label.split(' ');
          const lines: string[] = [];
          let line = '';
  
          words.forEach((word: string) => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
  
            if (testWidth > maxLabelWidth && line !== '') {
              lines.push(line);
              line = word + ' ';
            } else {
              line = testLine;
            }
          });
  
          lines.push(line);
  
          let labelY = canvas.height - 10;
          lines.forEach((line: string) => {
            ctx.fillText(line, bar.x + bar.width / 2, labelY);
            labelY += lineHeight;
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
