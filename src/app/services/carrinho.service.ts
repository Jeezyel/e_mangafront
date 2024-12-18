import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ItemCarrinho } from '../models/item-carrinho.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) { 
    // verificando se tem dados no carrinho no local storage e atualiza o subject
    const carrinhoArmazenado = localStorageService.getItem('carrinho') || [];
    this.carrinhoSubject.next(carrinhoArmazenado);
  }

  adicionar(itemCarrinho: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    const itemExistente = carrinhoAtual.find(item => item.id === itemCarrinho.id);

    if (itemExistente) {
      itemExistente.quantidade += itemCarrinho.quantidade || 1;
    } else {
      carrinhoAtual.push(itemCarrinho);
    }

    console.log('Carrinho atualizado:', carrinhoAtual);
    this.carrinhoSubject.next(carrinhoAtual);
    this.atualizarArmazenamentoLocal();
  }

  // Garante que o usuário está logado antes de finalizar
  finalizarCompra(): boolean {
    const usuarioLogado = this.localStorageService.getItem('usuarioLogado');
    if (!usuarioLogado) {
        alert('É necessário estar logado para finalizar a compra.');
        return false;
    }

    const carrinho = this.carrinhoSubject.value;
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return false;
    }

    return true;
  }

  removerTudo(): void {
    this.localStorageService.removeItem('carrinho');
    window.location.reload(); // reload na pagina
  }

  removerItem(itemCarrinho: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    const carrinhoAtualizado = carrinhoAtual.filter(item => item.id !== itemCarrinho.id);

    this.carrinhoSubject.next(carrinhoAtualizado);
    this.atualizarArmazenamentoLocal();
  }

  obter() : ItemCarrinho[] {
    return this.carrinhoSubject.value;
  }

  private atualizarArmazenamentoLocal(): void {
    this.localStorageService.setItem('carrinho', this.carrinhoSubject.value);
  }

  limparCarrinho(): void {
    this.carrinhoSubject.next([]); // Limpa o carrinho
    this.atualizarArmazenamentoLocal(); // Atualiza o armazenamento local
  }

}