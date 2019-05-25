import { resena } from 'src/app/interfaces/resena.interface';
import { lugar } from 'src/app/interfaces/lugar.interface';

export class usuario {
    id: number;
    nombre: string;
    apellidos: string;
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
