import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router'; 
import { LoginService } from 'src/app/service/login.service';
import { UserData } from 'src/app/model/userdata';
import { CerrarSesionComponent } from '../dialogo/cerrar-sesion/cerrar-sesion.component';
import { BannerComponent } from '../vistas/banner/banner.component';

@Component({
  selector: 'app-user-credentials',
  templateUrl: './user-credentials.component.html',
  styleUrls: ['./user-credentials.component.css']
})
export class UserCredentialsComponent implements OnInit, OnDestroy {
  user: UserData = new UserData();
  error: string;
  subscriptionDuration: string = '';
  subscriptionClass: string = '';
  intervalId: any;
  bannerShown: boolean = false;  // Añadir un indicador para saber si el banner ya fue mostrado

  constructor(private loginService: LoginService, private dialog: MatDialog, private router: Router) {
    this.error = ''; 
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.intervalId = setInterval(() => {
      this.calculateSubscriptionDuration();
    }, 1000); // Actualiza cada segundo
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Limpia el intervalo cuando el componente se destruye
    }
  }

  getUserDetails() {
    this.loginService.getUserDetails().subscribe(
      data => {
        this.user = data;
        this.calculateSubscriptionDuration(); // Llama a la función al cargar los datos
      },
      error => {
        this.error = error;
        console.error('Error al obtener los detalles del usuario', error);
      }
    );
  }

  calculateSubscriptionDuration() {
    if (this.user.subscriptionStartDate && this.user.subscriptionEndDate) {
        const startDate = new Date(this.user.subscriptionStartDate);
        const endDate = new Date(this.user.subscriptionEndDate);
        const currentTime = new Date().getTime();

        if (currentTime >= endDate.getTime()) {
            this.subscriptionDuration = 'La suscripción ha expirado';
            this.subscriptionClass = 'rojo'; // Aplicar clase roja para suscripción expirada

            // Mostrar banner una sola vez
            if (!this.bannerShown) {
                this.mostrarBanner();
                this.bannerShown = true;  // Marcar que el banner ya ha sido mostrado
            }
            return;
        }

        const diffInMilliseconds = endDate.getTime() - currentTime;

        const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        const remainingHours = diffInHours % 24;
        const remainingMinutes = diffInMinutes % 60;
        const remainingSeconds = diffInSeconds % 60;

        this.subscriptionDuration = `${diffInDays} días, ${remainingHours} horas, ${remainingMinutes} minutos y ${remainingSeconds} segundos`;

        // Aplicar la clase CSS según el rango de días
        if (diffInDays <= 3) {
            this.subscriptionClass = 'rojo';
        } else if (diffInDays > 3 && diffInDays <= 7) {
            this.subscriptionClass = 'naranja';
        } else {
            this.subscriptionClass = '';
        }
    } else {
        this.subscriptionDuration = 'Fechas no disponibles';
        this.subscriptionClass = '';
    }
  }

  mostrarBanner() {
    this.dialog.open(BannerComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
        user: this.user,
        subscriptionDuration: this.subscriptionDuration
      }
    });
  }
  

  // Método comentado para cerrar sesión, en caso de que lo necesites en el futuro
  /*
  cerrarSesionAutomatica() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  */

  cerrar() {
    const dialogRef = this.dialog.open(CerrarSesionComponent, {
      width: '300px',
      data: { mensaje: '¿Estás seguro de cerrar la sesión?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  irAPagar() {
    this.router.navigate(['/components/pago']);
  }
  
}
