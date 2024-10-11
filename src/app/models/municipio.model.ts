import { Estado } from "./estado.model";

export class Municipio {
    id!: number;
    nome!: string;
    nomeEstado!: string
    estado!: Estado;
}