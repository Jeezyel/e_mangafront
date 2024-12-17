import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf, CommonModule } from '@angular/common';

import { ItemCarrinho } from '../../models/item-carrinho.model';
import { CarrinhoService } from '../../services/carrinho.service';
import { AuthService } from '../../services/auth.service';
import { MangaService } from '../../services/manga.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    public mangaService: MangaService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router 
  ){}
  
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
      this.router.navigate(['/login'], { queryParams: { perfil: 'USER' } }); // Redireciona para a página de login
      return;
    }

    // Obtém os dados do usuário logado
    const usuarioLogado = this.authService['usuarioLogadoSubject'].value;
    
    if (!usuarioLogado) {
      alert('Erro ao buscar os dados do usuário!');
      return;
    }
    
    // Verifica o perfil do usuário
    const perfil = usuarioLogado.perfil;
    if (perfil === 'ADMIN') {
      alert('Você está logado como ADMIN. Faça login com um perfil de usuário para finalizar a compra.');
      this.authService.logout();
      this.router.navigate(['/login'], { queryParams: { perfil: 'USER' } });
      return;
    }

    if (perfil !== 'USER') {
      alert('Perfil inválido. Faça login como usuário.');
      this.authService.logout();
      this.router.navigate(['/user/login']);
      return;
    }

    // Redireciona para a página de pedido com dados pré-preenchidos
    this.router.navigate(['/user/pedido'], { state: { usuario: usuarioLogado } });
    
    // Lógica para finalizar a compra (envio dos dados, redirecionamento, etc.)
    alert('Compra finalizada com sucesso!');
    this.carrinhoService.limparCarrinho(); // Limpa o carrinho após a compra
    this.router.navigate(['/']); // Redireciona para a página inicial
  }

}