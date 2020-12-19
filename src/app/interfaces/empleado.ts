import { StringMap } from "@angular/compiler/src/compiler_facade_interface";

export interface Empleado {
    id?: string | any,
    nombre: string
    apellido: string,
    documento: string,
    salario: string,
    fechaCreacion?: Date,
    fechaActualizacion?: Date
}
