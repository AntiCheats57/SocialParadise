import { resena } from './resena.interface';
import { lugar } from './lugar.interface';

export interface usuario {
    id: number;
    nombre: string;
    apellidos: string;
    usuario: string;
    clave: string;
    correo: string;
    foto: string;
    admin: string;
    resenas: Array<resena>;
    lugaresAsignados: Array<lugar>;
    lugaresSeguidos: Array<lugar>;
}