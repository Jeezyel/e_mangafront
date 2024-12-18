import { Estado } from "./estado.model";
import { Municipio } from "./municipio.model";

export interface Telefone {
    codigoDeArea: string;
    numero: string;
}

export interface Endereco {
    cep: string;
    logradouro: string;
    complemento?: string;
    bairro: string;
    municipio: Municipio;
    estado: Estado;
}

export class Usuario {
    id!: number;
    nome!: string;
    email!: string;
    perfil!: string; 
    username!: string;
    senha!: string;
    telefone?: Telefone[] = [];
    endereco?: Endereco[] = [];
}