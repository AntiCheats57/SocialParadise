import { resena } from './resena.interface';
import { lugar } from './lugar.interface';

export class usuario {
    id: number;
    nombre: string;
    apellidos: string;
    usuario: string;
    clave: string;
    correo: string;
    foto: string;
    resenas: Array<resena>;
    lugaresAsignados: Array<lugar>;
    lugaresSeguidos: Array<lugar>;
    admin: string;

    constructor(){

    }
}