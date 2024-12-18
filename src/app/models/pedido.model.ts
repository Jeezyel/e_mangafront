import { Endereco } from "./endereco.model";
import { ItemCarrinho } from "./item-carrinho.model";
import { Telefone } from "./telefone.model";
import { Usuario } from "./usuario.model";

export class Pedido {
    id!: number;
    usuario!: Usuario;
    endereco!: Endereco;
    telefone!: Telefone;
    itens!: ItemCarrinho[];
    valorTotal!: number;
    formaDePagamento!: string;
    quantidadeDeParcelas!: number;
    status!: string;
}