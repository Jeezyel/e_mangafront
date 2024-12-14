import { Perfil } from "./perfil.model";
import { Endereco } from "./endereco.model";
import { Telefone } from "./telefone.model";

export class Usuario {
    id!: number;
    nome!: string;
    email!: string;
    telefone!: Telefone;
    endereco!: Endereco;
    perfil!: Perfil[]; 
    username!: string;
    senha!: string;
}