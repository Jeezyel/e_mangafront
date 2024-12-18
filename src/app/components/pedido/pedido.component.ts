import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { FormaDePagamento } from '../../models/formaDePagamento.model';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  endereco: string = '';
  formaDePagamento: FormaDePagamento | null = null;
  errorMessage: string = '';

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { perfil: 'USER' } });
    }

    this.usuarioService.buscarUsuarioLogado().subscribe(
      (usuario: Usuario) => {
        this.endereco = usuario.endereco && usuario.endereco[0] ? usuario.endereco[0] : '';
      },
      (error: any) => {
        this.errorMessage = 'Erro ao carregar os dados do usuário.';
      }
    );
  }

  finalizarPedido(): void {
    if (!this.endereco || !this.formaDePagamento) {
      this.errorMessage = 'Por favor, preencha todos os dados antes de finalizar o pedido.';
      return;
    }

    const itensCarrinho = this.pedidoService.getCarrinhoItens().map(item => ({
      id: item.produtoId,
      nome: item.nome || '',
      preco: item.valor,
      quantidade: item.quantidade,
      nomeImagem: item.nomeImagem || ''
    }));

    const pedido = {
      endereco: this.endereco,
      formaDePagamento: this.formaDePagamento,
      itens: itensCarrinho,
    };

    this.pedidoService.criarPedido(pedido).subscribe(
      (response: any) => {
        this.router.navigate(['/pedido/sucesso']);
      },
      (error: any) => {
        this.errorMessage = 'Erro ao finalizar o pedido.';
      }
    );
  }

  selecionarFormaDePagamento(forma: FormaDePagamento): void {
    this.formaDePagamento = forma;
  }
}