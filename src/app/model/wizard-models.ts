export class WizardProveedor {
    proveedorId?: number;
    nombre: string;
  
    constructor() {
      this.nombre = '';
    }
  }
  
  export class WizardSocio {
    socioId?: number;
    name: string;
  
    constructor() {
      this.name = '';
    }
  }
  
  export class WizardService {
    serviceId?: number;
    service: string;
    description: string;
  
    constructor() {
      this.service = '';
      this.description = '';
    }
  }
  
  export class WizardPerfil {
    perfilId?: number;
    service: WizardService;
    correo: string;
    contrasena: string;
    fechainicio: Date;
    fechafin: Date;
    limiteUsuarios: number;
    usuariosActuales: number;
    usuariosDisponibles: number;
    proveedor?: WizardProveedor;
  
    constructor() {
      this.service = new WizardService();
      this.correo = '';
      this.contrasena = '';
      this.fechainicio = new Date();
      this.fechafin = new Date();
      this.limiteUsuarios = 0;
      this.usuariosActuales = 0;
      this.usuariosDisponibles = 0;
    }
  }
  
  export class WizardCliente {
    idcs?: number;
    name: string;
    services: WizardService;
    perfil: WizardPerfil;
    fechainicio: Date;
    fechafin: Date;
    estado: string;
    socio?: WizardSocio;
    numerocelular?: string;
  
    constructor() {
      this.name = '';
      this.services = new WizardService();
      this.perfil = new WizardPerfil();
      this.fechainicio = new Date();
      this.fechafin = new Date();
      this.estado = '';
    }
  }
