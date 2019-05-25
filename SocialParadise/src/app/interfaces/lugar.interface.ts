import { resena } from 'src/app/interfaces/resena.interface';
import { usuario } from 'src/app/interfaces/usuario.interface';

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
