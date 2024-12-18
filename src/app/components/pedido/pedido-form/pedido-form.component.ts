import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PedidoService } from '../../../services/pedido.service';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';
import { FormaDePagamento } from '../../../models/formaDePagamento.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.css']
})
export class PedidoFormComponent implements OnInit {

  pedidoForm: FormGroup;

  endereco: string = '';
  formaDePagamento: FormaDePagamento | null = null;
  errorMessage: string = '';
  itensCarrinho: any[] = [];
  total: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ){
    this.pedidoForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      endereco: ['', Validators.required],
      telefone: ['', Validators.required],
      formaPagamento: ['', Validators.required]
    });
  } 

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

  onSubmit(): void{
    if (this.pedidoForm.valid) {
      console.log('Pedido enviado:', this.pedidoForm.value);
      // Adicione lógica para processar o pedido aqui
    } else {
      console.error('Formulário inválido');
    }
  }

  selecionarFormaDePagamento(forma: FormaDePagamento): void {
    this.formaDePagamento = forma;
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
        this.router.navigate(['/pedidos']);
      },
      (error: any) => {
        this.errorMessage = 'Erro ao finalizar o pedido.';
      }
    );
  }

  cancelarPedido(): void {
    this.pedidoForm.reset();
    console.log('Pedido cancelado');
  }
}