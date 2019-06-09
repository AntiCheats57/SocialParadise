export interface resena {
    id: number;
    idFB: string;
    lugar: number;
    usuario: number;
    valoracion: number;
    comentario: string;
    fechaPublicacion: string;
    censurado: boolean;
    tipo: string; //Tipos: "C" = Comentario, "R" = Respuesta
    respuestas: number[];
}
