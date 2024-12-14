import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf, CommonModule } from '@angular/common';

import { ItemCarrinho } from '../../models/item-carrinho.model';
import { CarrinhoService } from '../../services/carrinho.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {
  
  carrinhoItens: ItemCarrinho[] = [];

  constructor(
    private carrinhoService: CarrinhoService,
    private authService: AuthService,
    private router: Router )
  {  }
  
  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe(itens => { 
      this.carrinhoItens = itens;
    });
  }

  removerItem(item: ItemCarrinho) {
    this.carrinhoService.removerItem(item);
  }

  calcularTotal(): number {
    return this.carrinhoItens.reduce((total, item) => total + item.quantidade * item.preco, 0);
  }

  finalizarCompra() {
    // Verifica se o usuário está logado
    if (!this.authService.isLoggedIn()) {
      alert('Você precisa estar logado para finalizar a compra.');
      this.router.navigate(['/user/login']); // Redireciona para a página de login
      return;
    }

    // Lógica para finalizar a compra (envio dos dados, redirecionamento, etc.)
    alert('Compra finalizada com sucesso!');
    this.carrinhoService.limparCarrinho(); // Limpa o carrinho após a compra
    this.router.navigate(['/']); // Redireciona para a página inicial
  
  }

}