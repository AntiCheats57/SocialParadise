import { resena } from './resena.interface';
import { usuario } from './usuario.interface';

export interface lugar {
    id: number;
    nombre: string;
    video: string;
    descripcion: string;
    seguidores: number;
    resenas: Array<resena>;
    imagenes: Array<string>;
    usuario: usuario;
}