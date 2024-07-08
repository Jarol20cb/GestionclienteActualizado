import { Proveedor } from './Proveedor';
import { Services } from './Services';


export class Perfil {
    perfilId: number = 0;
    service: Services = new Services();
    correo: string = "";
    contrasena: string = "";
    fechainicio: Date = new Date();
    fechafin: Date = new Date();
    limiteUsuarios: number = 0;
    usuariosActuales: number = 0;
    usuariosDisponibles: number = 0;
    proveedor: Proveedor = new Proveedor();
}
