import { Services } from './Services';
import { Perfil } from './Perfil';
import { Socio } from './socio';

export class CustomersServices {
    idcs: number = 0;
    name: string = "";
    services: Services = new Services();
    perfil: Perfil = new Perfil();
    fechainicio: Date = new Date();
    fechafin: Date = new Date();
    estado: string = "";
    socio: Socio = new Socio(); // Agregar Socio
}
