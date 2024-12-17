import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { FormaDePagamento } from '../../models/formaDePagamento.model';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  
  usuario: any = {};
  novoPedido: any = { endereco: '', telefone: '', itens: [] };
  formasDePagamento: FormaDePagamento[] = [];
  statusPedido: string = '';

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar se o usuario esta logado
    if (!this.authService.isLoggedIn()) {
      alert('Voce precisa estar logado para acessar seus pedidos.');
      this.router.navigate(['/user/login']);
      return;
    }

    // Obter dados do usuario logado
    this.usuario = this.authService.getUsuarioLogado();
    if (this.usuario.perfil !== 'USER') {
      alert('Apenas usuarios com perfil USER podem acessar esta pagina.');
      this.authService.logout();
      this.router.navigate(['/user/login']);
      return;
    }

    // Carregar pedidos do usuario
    this.carregarPedidos();

    // Carregar formas de pagamento
    this.carregarFormasDePagamento();
  }
  /*
  carregarPedidos() {
    this.pedidoService.findByUser(this.usuario.id).subscribe(
      (data) =>{
        this.atualizarStatusPedido();
      }, 
      (err) => console.error('Erro ao carregar pedidos:', err)
    );
  }
  */
  carregarFormasDePagamento() {
    this.pedidoService.findFormaDePagamento().subscribe(
      (data) => (this.formasDePagamento = data),
      (err) => console.error('Erro ao carregar formas de pagamento:', err)
    );
  }

  atualizarDados() {
    // Atualizar dados de usuario
    this.usuarioService.update(this.usuario).subscribe(
      () => alert('Dados atualizados com sucesso!'),
      (err) => console.error('Erro ao atualizar dados:', err)
    );
  }
  /*
  atualizarStatusPedido() {
    this.pedidos.forEach((pedido) => {
      this.pedidoService.getStatus(pedido.id).subscribe(
        (status: string) => (pedido.status = status),
        (err: any) => console.error(`Erro ao atualizar status do pedido #${pedido.id}:`, err)
      );
    });
  }
  */
  demonstrarPagamento() {
    alert('Pagamento realizado com sucesso! (Simulação demonstrativa)');
  }

  criarPedido() {
    this.novoPedido.itens = this.pedidoService.getCarrinhoItens();
    this.novoPedido.endereco = this.usuario.endereco;
    this.novoPedido.telefone = this.usuario.telefone;
    this.novoPedido.formaDePagamento = this.novoPedido.FormaDePagamento;

    this.pedidoService.create(this.novoPedido).subscribe(
      () => {
        alert('Pedido criado com sucesso!');
        this.carregarPedidos();
      },
      (err) => console.error('Erro ao criar pedido:', err)
    );
  }

}