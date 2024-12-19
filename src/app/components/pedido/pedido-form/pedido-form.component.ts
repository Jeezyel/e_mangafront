import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { PedidoService } from '../../../services/pedido.service';

import { FormaDePagamento } from '../../../models/formaDePagamento.model';
import { ItemCarrinho } from '../../../models/item-carrinho.model';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.css']
})
export class PedidoFormComponent implements OnInit {

  pedidoForm!: FormGroup;
  carrinhoItens: ItemCarrinho[] = [];
  totalCarrinho: number = 0;
  quantidadeDeParcelas: number [] = [];
  formaDePagamento: FormaDePagamento[]= []; 
  qrCodePix: string = '';
  copiaColaPix: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private carrinhoService: CarrinhoService
  ){}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarDadosDoUsuario();
    this.carregarCarrinho();
  }

  inicializarFormulario(): void {
    this.pedidoForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: this.fb.group({
        codigoDeArea: ['', Validators.required],
        numero: ['', Validators.required]
      }),
      endereco: this.fb.group({
        cep: ['', Validators.required],
        logradouro: ['', Validators.required],
        complemento: [''],
        bairro: ['', Validators.required],
        municipio: this.fb.group({
          nome: ['', Validators.required],
          estado: this.fb.group({
            nome: ['', Validators.required],
            sigla: ['', Validators.required]
          })
        })
      }),
      formaDePagamento: ['', Validators.required],
      quantidadeDeParcelas: [null],
      cartao: this.fb.group({
        numero: ['', Validators.required],
        nomeTitular: ['', Validators.required],
        validade: ['', Validators.required],
        cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]
      })
    });
  }

  carregarDadosDoUsuario(): void {
    this.authService.getUsuarioLogado().subscribe(usuario => {
      if (usuario) {
        this.pedidoForm.patchValue({
          nome: usuario.nome,
          email: usuario.email,
        });
      }
    });
  }

  carregarCarrinho(): void {
    this.carrinhoItens = this.carrinhoService.obter();
    this.totalCarrinho = this.carrinhoItens.reduce((total, item) => total + item.preco * item.quantidade, 0);
    this.calcularParcelas();
  }

  calcularParcelas(): void {
    this.quantidadeDeParcelas = Array.from({ length: 12 }, (_, i) => i + 1).map((parcela) => {
      return Number((this.totalCarrinho / parcela).toFixed(2));
    });
  }

  atualizarFormaDePagamento(): void {
    const forma = this.pedidoForm.get('formaDePagamento')?.value;
    const pagamentoSelecionado = this.formaDePagamento.find(f => f.label === forma);
    if (pagamentoSelecionado?.label === 'PIX') {
      this.qrCodePix = 'URL_DA_IMAGEM_DO_QRCODE';
      this.copiaColaPix = 'chave-aleatoria-pix';
      this.pedidoForm.get('cartao')?.disable();
    } else if (pagamentoSelecionado?.label === 'CARTAO') {
      this.pedidoForm.get('cartao')?.enable();
    }
  }

  onSubmit(): void {
    if (this.pedidoForm.invalid) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const pedido = {
      ...this.pedidoForm.value,
      itens: this.carrinhoItens,
      valorTotal: this.totalCarrinho,
      status: 'PENDENTE'
    };

    this.pedidoService.criarPedido(pedido).subscribe(() => {
      alert('Pedido realizado com sucesso!');
      this.router.navigate(['user/usuario/pedidos']);
    });
  }
  
  cancelarPedido(): void {
    this.pedidoForm.reset();
    console.log('Pedido cancelado');
  }

}