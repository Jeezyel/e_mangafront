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
      this.router.navigate(['/login'], { queryParams: { perfil: 'USER' },});
      return;
    } 

    // Obtém os dados do usuário logado
    const usuarioLogado = this.authService['usuarioLogadoSubject'].value;
    if (!usuarioLogado || usuarioLogado.perfil !== 'USER') {
      alert('Faça login como usuário para finalizar a compra!');
      this.authService.logout();
      this.router.navigate(['/login'], { queryParams: { perfil: 'USER' } });
      return;
    } 

    this.router.navigate(['/user/pedidos/new'], {
      state: {
        carrinhoItens: this.carrinhoItens,
        total: this.calcularTotal()
      }
    });
    
    // Lógica para finalizar a compra (envio dos dados, redirecionamento, etc.)
    alert('Compra finalizada com sucesso!');
    this.carrinhoService.limparCarrinho(); // Limpa o carrinho após a compra
    this.router.navigate(['/']); // Redireciona para a página inicial
  }

}