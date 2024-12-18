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
    
    private baseUrl = 'http://localhost:8080/pedidos';
    
    constructor(
        private http: HttpClient, 
        private carrinhoService: CarrinhoService, 
        private localStorageService: LocalStorageService
    ) {}

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

    findByUser(usuario: number): Observable<Pedido> {
        return this.http.get<Pedido>(`${this.baseUrl}/user/${usuario}`);
    }

    criarPedido(pedido: Pedido): Observable<Pedido> {
        // Validação básica para evitar erros no envio de dados
        if (!pedido.endereco || !pedido.telefone || !pedido.formaDePagamento || !pedido.itens || pedido.itens.length === 0) {
            throw new Error('Pedido incompleto. Certifique-se de preencher todos os campos e incluir itens no carrinho.');
        }
        return this.http.post<Pedido>(this.baseUrl, pedido);
    }

    getCarrinhoItens(): ItemCarrinho[] {
        // Recupera os itens do Local Storage
        const itens = this.localStorageService.getItem('carrinho');
        return itens ? JSON.parse(itens) : [];
    }

    setCarrinhoItens(itens: ItemCarrinho[]): void {
        // Salva os itens no Local Storage
        this.localStorageService.setItem('carrinho', JSON.stringify(itens));
    }

    calcularTotalCarrinho(): number {
        const itens = this.getCarrinhoItens();
        return itens.reduce((total, item) => total + item.quantidade * item.preco, 0);
    }

    // Método para buscar perfil
    findFormaDePagamento(): Observable<FormaDePagamento[]> {
        return this.http.get<FormaDePagamento[]>(`${this.baseUrl}/formaDePagamento`);
    }

    getStatus(): Observable<Status[]> {
        return this.http.get<Status[]>(`${this.baseUrl}/status/`);
    }

}