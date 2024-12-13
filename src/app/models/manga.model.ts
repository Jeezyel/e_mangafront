import { Editora } from "./editora.model";
import { Genero } from "./genero.model";
import { Formato } from "./formato.model";
import { Idioma } from "./idioma.model";
import { ClassificacaoIndicativa } from "./classificacao-indicativa.model";

export class Manga {
    nomeImagem!: string;
    idManga!: number;
    nome!: string;
    valor!: number;
    editora!: Editora;
    genero!: Genero;
    formato!: Formato;
    idioma!: Idioma;
    classificacaoIndicativa!: ClassificacaoIndicativa;
    estoque!: number;
}