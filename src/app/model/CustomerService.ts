import { Services } from "./Services";
import { Socio } from "./socio";

export class CustomersServices {
    idcs: number = 0;
    name: string = "";
    services: Services = new Services();
    fechainicio: Date = new Date(Date.now());
    fechafin: Date = new Date(Date.now());
    estado: string = "";
    socio: Socio = new Socio(); // Agregar Socio
}
