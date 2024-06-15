import { Services } from "./Services"

export class CustomersServices {
    idcs: number = 0
    name: string = ""
    services: Services = new Services()
    fechainicio: Date = new Date(Date.now())
    fechafin: Date = new Date(Date.now())
    estado: string = ""
}