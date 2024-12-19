import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { PedidoService } from '../../../services/pedido.service';
import { UsuarioService } from '../../../services/usuario.service';

import { FormaDePagamento } from '../../../models/formaDePagamento.model';
import { ItemCarrinho } from '../../../models/item-carrinho.model';
import { Telefone } from '../../../models/telefone.model';
import { Endereco } from '../../../models/endereco.model';
import { Usuario } from '../../../models/usuario.model';

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
  quantidadeDeParcela: number [] = [];
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
      telefone: this.fb.group({
        codegoDeArea: ['', Validators.required],
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
      quantidadeDeParcelas: [null]
    });
  }

  carregarDadosDoUsuario(): void {
    this.authService.getUsuarioLogado().subscribe(usuario => {
      if (usuario) {
        this.pedidoForm.patchValue({
          id: usuario.id,
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
    this.quantidadeDeParcela = Array.from({ length: 12 }, (_, i) => i + 1).map((parcela) => {
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

    // Obtendo o ID do usuário logado
    const usuarioLogado = this.authService.getUsuarioLogado();

    if (!usuarioLogado) {
      alert('Erro: Não foi possível identificar o usuário logado.');
      return;
    }

    // Transformando os dados do formulário para o formato esperado pelo backend
    const pedido = {
      id: 0,
      usuario: this.pedidoForm.get('id')?.value,// ID do usuário logado
      produto: this.carrinhoItens, // Apenas os IDs dos produtos
      valortotal: this.totalCarrinho, // Total do carrinho
      formaDePagamento: this.pedidoForm.get('formaDePagamento')?.value,
      quantidadeParcela: this.pedidoForm.get('quantidadeDeParcela')?.value || 1,
      nome: this.pedidoForm.get('nome')?.value,
      email: this.pedidoForm.get('email')?.value,
      telefone: [
        {
          id: 0, // Assumindo que será gerado pelo backend
          codegoDeArea: this.pedidoForm.get('telefone.codegoDeArea')?.value,
          numero: this.pedidoForm.get('telefone.numero')?.value,
        },
      ],
      endereco: [
        {
          id: 0, // Assumindo que será gerado pelo backend
          cep: this.pedidoForm.get('endereco.cep')?.value,
          logradouro: this.pedidoForm.get('endereco.logradouro')?.value,
          complemento: this.pedidoForm.get('endereco.complemento')?.value || '',
          bairro: this.pedidoForm.get('endereco.bairro')?.value,
          municipio: {
            id: 0, // Assumindo que será gerado pelo backend
            nome: this.pedidoForm.get('endereco.municipio.nome')?.value,
            estado: {
              id: 0, // Assumindo que será gerado pelo backend
              nome: this.pedidoForm.get('endereco.municipio.estado.nome')?.value,
              sigla: this.pedidoForm.get('endereco.municipio.estado.sigla')?.value,
            },
          },
        },
      ],
    };

    console.log('Enviando pedido:', pedido);

    // Enviando o pedido ao backend
    this.pedidoService.criarPedido(pedido).subscribe(() => {
      alert('Pedido realizado com sucesso!');
      this.router.navigate(['/usuario/pedidos']);
    });
  
    // Armazenando dados extras no Local Storage
    const dadosExtras = {
      parcelasDetalhadas: this.quantidadeDeParcela, // Dados de parcelas detalhadas
      qrCodePix: this.qrCodePix, // QR Code para Pix
      copiaColaPix: this.copiaColaPix, // Código para Pix
    };

    localStorage.setItem('dadosExtrasPedido', JSON.stringify(dadosExtras));      
  
  }
  
  cancelarPedido(): void {
    this.pedidoForm.reset();
    console.log('Pedido cancelado');
  }

}