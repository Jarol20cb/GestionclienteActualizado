import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/service/login.service';
import { BannerComponent } from '../banner/banner.component';
import { Router } from '@angular/router';
import { BienvenidaComponent } from '../bienvenida/bienvenida.component';
import { UserWithDates } from 'src/app/model/user/UserWithDates';
import { Message } from 'src/app/model/Message';
import { MessageService } from 'src/app/service/message-service.service';
import { AdministracionService } from 'src/app/service/administracion.service';

@Component({
  selector: 'app-banner-manager',
  templateUrl: './banner-manager.component.html',
  styleUrls: ['./banner-manager.component.css']
})
export class BannerManagerComponent implements OnInit {
  user: UserWithDates = new UserWithDates({});
  bannerQueue: any[] = [];
  isBannerActive: boolean = false;
  specialPromotionActive: boolean = false;
  maintenanceActive: boolean = false; 
  maintenanceStartDate: Date = new Date();
  maintenanceEndDate: Date = new Date();
  subscriptionDuration: string = '';
  error: string = '';
  subscriptionClass: string = '';

  constructor(
    private loginService: LoginService, 
    private dialog: MatDialog, 
    private router: Router,
    private renderer: Renderer2,
    private messageService: MessageService, 
    private mensajesadministrados: AdministracionService
  ) {}

  ngOnInit(): void {
    this.checkAccountStatus();
    this.getUserDetails();
  }

  calculateSubscriptionDuration() {
    if (this.user.subscriptionStartDate && this.user.subscriptionEndDate) {
        const startDate = new Date(this.user.subscriptionStartDate);
        const endDate = new Date(this.user.subscriptionEndDate);
        const currentTime = new Date().getTime();

        const diffInMilliseconds = endDate.getTime() - currentTime;

        const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        const remainingHours = diffInHours % 24;
        const remainingMinutes = diffInMinutes % 60;
        const remainingSeconds = diffInSeconds % 60;

        this.subscriptionDuration = `${remainingHours} horas, ${remainingMinutes} minutos`;
    }
}  

  checkAccountStatus() {
    this.loginService.getUserDetails().subscribe(
      data => {
        this.user = new UserWithDates(data);
        this.queueBanners();
        this.showNextBanner();
      },
      error => {
        console.error('Error al obtener los detalles del usuario', error);
      }
    );
  }

  isNewUser(): boolean {
    const accountCreationTime = new Date(this.user.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - accountCreationTime;
    const minutesSinceCreation = timeDifference / (1000 * 60);

    return minutesSinceCreation <= 5;
  }

  hasBannerBeenShown(bannerKey: string): boolean {
    return !!sessionStorage.getItem(bannerKey);
  }

  markBannerAsShown(bannerKey: string): void {
    sessionStorage.setItem(bannerKey, 'true');
  }

  getUserDetails() {
    this.loginService.getUserDetails().subscribe(
      data => {
        this.user = data;
        this.calculateSubscriptionDuration();
      },
      error => {
        this.error = error;
        console.error('Error al obtener los detalles del usuario', error);
      }
    );
  }
  

  queueBanners() {
    this.calculateSubscriptionDuration();
    const currentTime = new Date().getTime();
    const endDate = new Date(this.user.subscriptionEndDate).getTime();
    const daysLeft = Math.floor((endDate - currentTime) / (1000 * 60 * 60 * 24));
    const timeLeft = endDate - currentTime;

    // Banner para renovación de suscripción si quedan 24 horas o menos
    if (timeLeft <= 24 * 60 * 60 * 1000) {
      this.bannerQueue.push({
        title: 'Paga tu suscripción',
        image: 'assets/bienvenida/dinero-animado.gif',
        message: [
          `Hola, ${this.user.name}.`,
          `Tu suscripción al plan ${this.user.accountType} terminará en ${this.subscriptionDuration}.`,
          'Para disfrutar de los beneficios de tu cuenta Premium.'
      ],
        buttons: [
          { text: 'Pagar Suscripción', class: 'renew-button', action: () => this.onRenew() }
        ],
        allowClose: false
      });
    }

    // Banner de bienvenida para nuevos usuarios
    if (this.isNewUser() && !this.hasBannerBeenShown('welcomeBannerShown')) {
      this.bannerQueue.push({
        component: 'BienvenidaComponent',
        action: () => {
          const dialogRef = this.dialog.open(BienvenidaComponent, {
            width: 'auto',
            height: 'auto',
            disableClose: false,
            panelClass: 'custom-dialog-backdrop',
            data: { allowClose: true }
          });

          // Aplicar el estilo de desenfoque después de que el diálogo se haya abierto
          dialogRef.afterOpened().subscribe(() => {
            const overlayPane = document.querySelector('.cdk-overlay-backdrop');
            if (overlayPane) {
              this.renderer.setStyle(overlayPane, 'backdrop-filter', 'blur(10px)');
            }
          });

          dialogRef.afterClosed().subscribe(() => {
            this.isBannerActive = false;
            this.showNextBanner();
          });

          this.markBannerAsShown('welcomeBannerShown');
        }
      });
    }

    // Banner de suscripción expirada
    if (currentTime >= endDate) {
      this.bannerQueue.push({
        title: 'Suscripción Expirada',
        image: 'assets/koala-mareado.png',
        message: [
          `Hola, ${this.user.name}.`,
          `Tu suscripción al plan ${this.user.accountType} ha expirado.`,
          `Última fecha de pago: ${this.user.lastPaymentDate ? new Date(this.user.lastPaymentDate).toLocaleString() : 'No disponible'}.`,
          `Fecha fin de suscripción: ${new Date(this.user.subscriptionEndDate).toLocaleString()}.`,
          `Por favor, renueva para continuar usando el servicio.`
        ],
        buttons: [
          { text: 'Renovar Suscripción', class: 'renew-button', action: () => this.onRenew() },
          { text: 'Cerrar Sesión', class: 'logout-button', action: () => this.onLogout() }
        ],
        allowClose: false
      });
    }

    // Banner de promoción especial (solo si está activado, y solo una vez por sesión)
    if (this.specialPromotionActive && !this.hasBannerBeenShown('promoBannerShown')) {
      this.bannerQueue.push({
        title: '¡Oferta Especial!',
        image: 'assets/banners/promo.png',
        message: [`¡Aprovecha nuestra oferta especial por tiempo limitado, ${this.user.name}!`],
        buttons: [{ text: 'Ver Oferta', class: 'promo-button', action: () => this.onPromo() }],
        allowClose: true
      });
      this.markBannerAsShown('promoBannerShown');
    }

    // Banner para mejora a Premium (solo una vez por sesión)
    if (this.user.accountType === 'FREE' && daysLeft <= 15 && !this.hasBannerBeenShown('upgradeBannerShown')) {
      this.bannerQueue.push({
        title: 'Mejora a Premium',
        image: 'assets/premium.png',
        message: [
          '¡Mejora tu experiencia! Cámbiate a Premium y disfruta de los siguientes beneficios:',
          '• Gestión completa de proveedores',
          '• Gestión completa de socios',
          '• Gestión completa de servicios',
          '• Gestión completa de perfiles',
          '• Soporte prioritario por correo y teléfono',
          '• Actualizaciones mensuales',
          `Te quedan ${daysLeft} días para aprovechar esta oportunidad.`
        ],
        buttons: [{ text: 'Mejorar a Premium', class: 'upgrade-button', action: () => this.onUpgrade() }],
        allowClose: true
      });
      this.markBannerAsShown('upgradeBannerShown');
    }

    // Banner de recordatorio de pago (solo si faltan 3 días o menos, y solo una vez por sesión)
    if (this.user.accountType === 'PREMIUM' && daysLeft <= 3 && daysLeft > 0 && !this.hasBannerBeenShown('paymentReminderShown')) {
      this.bannerQueue.push({
        title: 'Recordatorio de Pago',
        image: 'assets/banners/recordatorio.png',
        message: [
          `Estimado/a ${this.user.name},`,
          `Tu suscripción al plan PREMIUM está próxima a renovarse el ${new Date(this.user.subscriptionEndDate).toLocaleString()}.`,
          'Para evitar cualquier interrupción en el servicio, te recomendamos actualizar tu pago a la brevedad.',
          '¡No te pierdas los beneficios exclusivos que solo ofrece nuestro plan PREMIUM!'
        ],
        buttons: [
          { text: 'Actualizar Pago', class: 'update-payment-button', action: () => this.onUpdatePayment() },
          { text: 'Más Información', class: 'info-button', action: () => this.onMoreInfo() }
        ],
        allowClose: true
      });
      this.markBannerAsShown('paymentReminderShown');
    }

    // Banner de advertencia de mantenimiento (solo si está activado)
    if (this.maintenanceActive && !this.hasBannerBeenShown('maintenanceBannerShown')) {
      const maintenanceStart = new Date(this.maintenanceStartDate).toLocaleString();
      const maintenanceEnd = new Date(this.maintenanceEndDate).toLocaleString();

      this.bannerQueue.push({
        title: 'Mantenimiento Programado',
        image: 'assets/banners/mantenimiento.png',
        message: [
          `Estimado usuario, se realizará un mantenimiento en la aplicación.`,
          `Inicio: ${maintenanceStart}`,
          `Fin: ${maintenanceEnd}`,
          `Por favor, guarde su trabajo y cierre sesión antes de que comience el mantenimiento.`
        ],
        buttons: [{ text: 'Entendido', class: 'ok-button', action: () => this.onStart() }],
        allowClose: true
      });
      this.markBannerAsShown('maintenanceBannerShown');
    }

    if (this.user.roles.includes('ADMIN')) {
      this.mensajesadministrados.listarPagosPendientes().subscribe(
        (messages: Message[]) => {
          console.log(messages);  // Verifica que los mensajes estén llegando
          const pendingMessages = messages.filter(message => message.status === 'PENDING');
          if (pendingMessages.length > 0) {
            console.log('Se encontraron mensajes pendientes para revisión');
            this.bannerQueue.push({
              title: 'Mensajes Pendientes de Revisión',
              image: 'assets/banners/lisa-feliz.gif',
              message: [
                `Hola, ${this.user.name}.`,
                'Tienes pagos pendientes para revisión.'
              ],
              buttons: [
                { text: 'Revisar Mensajes', class: 'review-button', action: () => this.router.navigate(['/components/verificar-pagos']) }
              ],
              allowClose: true
            });
            this.markBannerAsShown('pendientes');
    
            // Intentamos mostrar el banner de inmediato
            this.showNextBanner();
          } else {
            console.log('No se encontraron mensajes pendientes para revisión');
          }
        },
        error => {
          console.error('Error al listar los mensajes pendientes', error);
        }
      );
    }
    

  }

  onRenew() {
    this.router.navigate(['/components/pago']);
    this.showNextBanner();
  }

  onLogout() {
    sessionStorage.clear();
    this.showNextBanner();
    this.router.navigate(['/login']);
  }

  onUpgrade() {
    this.router.navigate(['/components/pago']);
    this.showNextBanner();
  }

  onUpdatePayment() {
    this.router.navigate(['/components/pago']);
    this.showNextBanner();
  }

  onPromo() {
    alert('Redirigiendo a la página de la oferta especial...');
    this.showNextBanner();
  }

  onStart() {
    alert('Comenzando tu sesión...');
    this.showNextBanner();
  }

  onMoreInfo() {
    alert('Redirigiendo a la página con más información sobre la renovación...');
    this.showNextBanner();
  }

  showNextBanner() {
    if (this.isBannerActive || this.bannerQueue.length === 0) return;
  
    this.isBannerActive = true;
    const nextBanner = this.bannerQueue.shift();
  
    if (nextBanner.component === 'BienvenidaComponent') {
      nextBanner.action();
    } else {
      const dialogRef = this.dialog.open(BannerComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: !nextBanner.allowClose,
        data: nextBanner
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.isBannerActive = false;
        this.showNextBanner();
      });
    }
  }
}