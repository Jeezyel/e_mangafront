import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PedidoService } from '../../../services/pedido.service';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';
import { FormaDePagamento } from '../../../models/formaDePagamento.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.css']
})
export class PedidoFormComponent implements OnInit {

  endereco: string = '';
  formaDePagamento: FormaDePagamento | null = null;
  errorMessage: string = '';
  itensCarrinho: any[] = [];
  total: number = 0;

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
      (usuario: any) => {
        this.endereco = usuario.endereco && usuario.endereco[0] ? usuario.endereco[0].logradouro : '';
      },
      (error: any) => {
        this.errorMessage = 'Erro ao carregar os dados do usuário.';
      }
    );
    this.itensCarrinho = this.pedidoService.getCarrinhoItens();
    this.total = this.pedidoService.calcularTotalCarrinho();
  }

  finalizarPedido(): void {

    if (!this.endereco || !this.formaDePagamento) {
      this.errorMessage = 'Por favor, preencha todos os dados antes de finalizar o pedido.';
      return;
    }

    const pedido = {
      endereco: this.endereco,
      formaDePagamento: this.formaDePagamento,
      itens: this.itensCarrinho,
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