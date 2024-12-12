import { Municipio } from "./municipio.model";

export class Endereco {
    idEndereco!: number;
    cep!: string;
    logradouro!: string;
    complemento!: string;
    bairro!: string;
    municipio!: Municipio;
}