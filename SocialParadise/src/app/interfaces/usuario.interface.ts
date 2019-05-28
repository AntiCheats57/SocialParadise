export interface usuario {
    id: number;
    idFB: string;
    nombre: string;
    apellidos: string;
    usuario: string;
    clave: string;
    correo: string;
    foto: string;
    resenas: number[];
    lugaresAsignados: number[];
    lugaresSeguidos: number[];
    admin: boolean;
}
