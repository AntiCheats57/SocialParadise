export interface usuario {
    id: number;
    idFB: string;
    nombre: string;
    apellidos: string;
    clave: string;
    correo: string;
    foto: string;
    usuario: string;
    resenas: number[];
    lugaresAsignados: number[];
    lugaresSeguidos: number[];
    admin: boolean;
}
