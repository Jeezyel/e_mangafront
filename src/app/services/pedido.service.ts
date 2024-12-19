import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pedido } from '../models/pedido.model';
import { LocalStorageService } from './local-storage.service';
import { CarrinhoService } from './carrinho.service';
import { FormaDePagamento } from '../models/formaDePagamento.model';
import { Status } from '../models/status.model';
import { ItemCarrinho } from '../models/item-carrinho.model';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
    
    private baseUrl = 'http://localhost:8080/pedido';
    
    idsProduto: number[] = [];

    constructor(
        private http: HttpClient, 
        private carrinhoService: CarrinhoService, 
        private localStorageService: LocalStorageService
    ) {}

    // recupera todos os pedidos
    findAll(page: number, size: number): Observable<Pedido[]> {
        let params = {};
        if (page !== undefined && size !== undefined) {
        params = {
            page: page.toString(),
            size: size.toString(),
        };
        }
        console.log(params);
        return this.http.get<Pedido[]>(this.baseUrl, { params });
    }

    //busca um usuario específico pelo id
    findByUser(usuario: number): Observable<Pedido> {
        return this.http.get<Pedido>(`${this.baseUrl}/usuario/${usuario}`);
    }

    //cria um novo pedido no backend
    criarPedido(pedido: Pedido): Observable<Pedido> {
        // Validação básica para evitar erros no envio de dados
        if (!pedido.endereco || !pedido.telefone || !pedido.formaDePagamento || !pedido.produto || pedido.produto.length === 0) {
            throw new Error('Pedido incompleto. Certifique-se de preencher todos os campos e incluir itens no carrinho.');
        }

        this.idsProduto = pedido.produto.map(produto => produto.id);


        let params = {};
        if (pedido !== undefined) {

          params = {
            id: this.localStorageService.getItem("usuario_logado").id,
            produto: this.idsProduto,
            valortotal: pedido.valortotal,
            formaDePagamento: pedido.formaDePagamento,
            quantidadeParcela: pedido.quantidadeParcela,
            nome: pedido.nome,
            email: pedido.email,
            telefone: pedido.telefone,
            endereco: pedido.endereco

            
          };
        }

        console.log(params);


        return this.http.post<Pedido>(`${this.baseUrl}/insert/`, params);
        
    }

    // recupera itens do carrinho armazenados no local storage
    getCarrinhoItens(): ItemCarrinho[] {
        // Recupera os itens do Local Storage
        const itens = this.localStorageService.getItem('carrinho');
        return itens ? JSON.parse(itens) : [];
    }

    // salva itens do carrinho armazenados no local storage
    setCarrinhoItens(itens: ItemCarrinho[]): void {
        // Salva os itens no Local Storage
        this.localStorageService.setItem('carrinho', JSON.stringify(itens));
    }

    // Calcula o total do carrinho somando o preço e a quantidade de cada item.
    calcularTotalCarrinho(): number {
        const itens = this.getCarrinhoItens();
        return itens.reduce((total, item) => total + item.quantidade * item.preco, 0);
    }

    // Método para buscar forma de pagamento
    findFormaDePagamento(): Observable<FormaDePagamento[]> {
        return this.http.get<FormaDePagamento[]>(`${this.baseUrl}/formaDePagamento`);
    }

    // Método para buscar forma de pagamento
    getStatus(): Observable<Status[]> {
        return this.http.get<Status[]>(`${this.baseUrl}/status/`);
    }

}