import { Editora } from "./editora.model";
import { Formato } from "./formato.model";
import { Idioma } from "./idioma.model";
import { ClassificacaoIndicativa } from "./classificacaoindicativa.model";

export class Manga {
    idManga!: number;
    nome!: string;
    editora!: Editora
    formato!: Formato;
    idioma!: Idioma;
    classificacaoindicativa!: ClassificacaoIndicativa;
}