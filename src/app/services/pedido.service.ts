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
    private itensCarrinho: { 
        produtoId: number; 
        quantidade: number; 
        valor: number; 
        nome: string; 
        nomeImagem: string 
    }[] = [];
    
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

    criarPedido(pedido: { endereco: string; formaDePagamento: FormaDePagamento; itens: any[] }): Observable<Pedido> {
        return this.http.post<Pedido>(this.baseUrl, pedido);
    }

    getCarrinhoItens(): { produtoId: number; quantidade: number; valor: number; nome: string; nomeImagem: string }[] {
        return this.itensCarrinho;
    }

    setCarrinhoItens(itens: { produtoId: number; quantidade: number; valor: number; nome: string; nomeImagem: string }[]): void {
        this.itensCarrinho = itens;
    }

    calcularTotalCarrinho(): number {
        return this.itensCarrinho.reduce((total, item) => total + item.quantidade * item.valor, 0);
    }

    // Método para buscar perfil
    findFormaDePagamento(): Observable<FormaDePagamento[]> {
        return this.http.get<FormaDePagamento[]>(`${this.baseUrl}/formaDePagamento`);
    }

    getStatus(): Observable<Status[]> {
        return this.http.get<Status[]>(`${this.baseUrl}/status/`);
    }

}