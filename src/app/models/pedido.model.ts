import { Telefone } from "./telefone.model";
import { Endereco } from "./endereco.model";
import { ItemCarrinho } from "./item-carrinho.model";
import { Usuario } from "./usuario.model";

export class Pedido {
    id!: number; // ID do pedido
    usuario!: number; // ID do usuário
    produto!: ItemCarrinho[]; // Array de IDs dos produtos no request
    valortotal!: number; // Valor total do pedido
    formaDePagamento!: string; // Forma de pagamento (ex.: PIX, CARTAO)
    quantidadeParcela!: number; // Quantidade de parcelas
    nome!: string; // Nome do usuário
    email!: string; // Email do usuário
    telefone!: Telefone[]; // Lista de telefones
    endereco!: Endereco[]; // Lista de endereços
    status?: string | null; // Status do pedido (no response pode ser null)
}