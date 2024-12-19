import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { PedidoService } from '../../../services/pedido.service';
import { UsuarioService } from '../../../services/usuario.service';
import { MunicipioService } from '../../../services/municipio.service';

import { FormaDePagamento } from '../../../models/formaDePagamento.model';
import { ItemCarrinho } from '../../../models/item-carrinho.model';
import { Telefone } from '../../../models/telefone.model';
import { Endereco } from '../../../models/endereco.model';
import { Usuario } from '../../../models/usuario.model';
import { Municipio } from '../../../models/municipio.model';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.css']
})
export class PedidoFormComponent implements OnInit {

  pedidoForm!: FormGroup;
  municipios: Municipio[] = [];
  carrinhoItens: ItemCarrinho[] = [];
  totalCarrinho: number = 0;
  quantidadeDeParcela: number [] = [];
  formaDePagamento: FormaDePagamento[]= [];
  // Para PIX 
  qrCodePix: string = '';
  copiaColaPix: string = '';
  // Para Cartão
  numero: string = '';
  nomeTitular: string = '';
  cpf: string = '';
  validade: string = '';
  cvv: string = '';
  
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private municipioService: MunicipioService,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private carrinhoService: CarrinhoService
  ){}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarDadosDoUsuario();
    this.carregarMunicipios(); 
    this.carregarCarrinho();
  }

  inicializarFormulario(): void {
    this.pedidoForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: this.fb.group({
        codegoDeArea: ['', Validators.required],
        numero: ['', Validators.required],
      }),
      endereco: this.fb.group({
        cep: ['', Validators.required],
        logradouro: ['', Validators.required],
        complemento: [''],
        bairro: ['', Validators.required],
        municipio: ['', Validators.required], // Ajustado para ser um controle único
        nomeEstado: ['', Validators.required], // Ajustado para ser um controle único
      }),
      formaDePagamento: ['', Validators.required],
      quantidadeDeParcelas: [null],
    });
  }

  carregarDadosDoUsuario(): void {
    try {
      // Recupera o valor do localStorage
      const usuarioLogadoString = localStorage.getItem('usuario_logado');
  
      // Verifica se o valor existe
      if (!usuarioLogadoString) {
        console.warn('Nenhum dado encontrado no localStorage para "usuario_logado".');
        return;
      }
  
      // Tenta parsear o JSON
      const usuarioLogado = JSON.parse(usuarioLogadoString);
  
      // Verifica se os dados do usuário logado são válidos
      if (usuarioLogado?.nome && usuarioLogado?.email) {
        this.pedidoForm.patchValue({
          nome: usuarioLogado.nome,
          email: usuarioLogado.email,
        });
  
        // Desabilita os campos para edição
        this.pedidoForm.get('nome')?.disable();
        this.pedidoForm.get('email')?.disable();
      } else {
        console.error('Usuário logado inválido ou incompleto:', usuarioLogado);
      }
    } catch (error) {
      console.error('Erro ao parsear usuário do localStorage:', error);
    }
  }
  

  carregarMunicipios(): void {
    const page = 0; // Primeira página
    const size = 100; // Quantidade de registros por página
    this.municipioService.findAll(page, size).subscribe(
      (data) => {
        console.log('Dados dos municípios:', data); // Verifique a estrutura aqui
        this.municipios = data;
      },
      (error) => {
        console.error('Erro ao carregar municípios:', error);
      }
    );
  }

  onMunicipioChange(event: Event): void {
    const municipioId = parseInt((event.target as HTMLSelectElement).value, 10);
    const municipioSelecionado = this.municipios.find((m) => m.idMunicipio === municipioId);
  
    if (municipioSelecionado) {
      this.pedidoForm.patchValue({
        endereco: {
          municipio: {
            idMunicipio: municipioSelecionado.idMunicipio,
            nome: municipioSelecionado.nome, // Atualiza o nome do município
            nomeEstado: municipioSelecionado.nomeEstado // Atualiza a sigla do estado
          },
        },
      });
    }
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
      this.numero = '';
      this.nomeTitular = '';
      this.cpf = '';
      this.validade = '';
      this.cvv = '';
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
          idTelefone: 0, // Assumindo que será gerado pelo backend
          codegoDeArea: this.pedidoForm.get('telefone.codegoDeArea')?.value,
          numero: this.pedidoForm.get('telefone.numero')?.value,
        },
      ],
      endereco: [
        {
          idEndereco: 0, // Assumindo que será gerado pelo backend
          cep: this.pedidoForm.get('endereco.cep')?.value,
          logradouro: this.pedidoForm.get('endereco.logradouro')?.value,
          complemento: this.pedidoForm.get('endereco.complemento')?.value || '',
          bairro: this.pedidoForm.get('endereco.bairro')?.value,
          municipio: {
            idMunicipio: 0, // Assumindo que será gerado pelo backend
            nome: this.pedidoForm.get('endereco.municipio.nome')?.value,
            nomeEstado: this.pedidoForm.get('endereco.municipio.nomeEstado')?.value,
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