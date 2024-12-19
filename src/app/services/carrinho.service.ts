import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ItemCarrinho } from '../models/item-carrinho.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);

  // Um observable que mantém o estado atual do carrinho.  
  carrinho$ = this.carrinhoSubject.asObservable();

  // Adiciona um item ao carrinho. Se o item já existir, incrementa a quantidade.
  constructor(private localStorageService: LocalStorageService) { 
    // verificando se tem dados no carrinho no local storage e atualiza o subject
    const carrinhoArmazenado = localStorageService.getItem('carrinho') || [];
    this.carrinhoSubject.next(carrinhoArmazenado);
  }

  //Verifica se o usuário está logado e se o carrinho não está vazio antes de finalizar a compra.
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

  //Remove todos os itens do carrinho e recarrega a página.
  removerTudo(): void {
    this.localStorageService.removeItem('carrinho');
    window.location.reload(); // reload na pagina
  }

  //Remove um item específico do carrinho.
  removerItem(itemCarrinho: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    const carrinhoAtualizado = carrinhoAtual.filter(item => item.id !== itemCarrinho.id);

    this.carrinhoSubject.next(carrinhoAtualizado);
    this.atualizarArmazenamentoLocal();
  }

  //Retorna a lista atual de itens no carrinho.
  obter() : ItemCarrinho[] {
    return this.carrinhoSubject.value;
  }

  //Atualiza o estado do carrinho no LocalStorage.
  private atualizarArmazenamentoLocal(): void {
    this.localStorageService.setItem('carrinho', this.carrinhoSubject.value);
  }

  //Limpa o carrinho, removendo todos os itens.
  limparCarrinho(): void {
    this.carrinhoSubject.next([]); // Limpa o carrinho
    this.atualizarArmazenamentoLocal(); // Atualiza o armazenamento local
  }

}