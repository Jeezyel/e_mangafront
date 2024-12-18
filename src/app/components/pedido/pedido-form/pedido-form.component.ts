import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PedidoService } from '../../../services/pedido.service';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';
import { FormaDePagamento } from '../../../models/formaDePagamento.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importação necessária para *ngFor e *ngIf

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.css']
})
export class PedidoFormComponent implements OnInit {

  pedidoForm!: FormGroup;

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
  ){}

  ngOnInit(): void {
    // Verifica se o usuário está logado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { perfil: 'USER' } });
    }

    // Inicializa o formulário antes de preencher valores
    this.inicializarFormulario();

    // Busca os dados do usuário logado
    this.usuarioService.buscarUsuarioLogado().subscribe(
      (usuario: any) => {
        // Preenche o endereço com os dados do usuário
        this.endereco = usuario.endereco && usuario.endereco[0] ? usuario.endereco[0].logradouro : '';
      },
      (error: any) => {
        this.errorMessage = 'Erro ao carregar os dados do usuário.';
      }
    );
    // Carrega os itens do carrinho e o total
    this.itensCarrinho = this.pedidoService.getCarrinhoItens();
    this.total = this.pedidoService.calcularTotalCarrinho();
  }

  inicializarFormulario(): void {  
    console.log("iniciando o forme")
    this.pedidoForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: this.fb.array([this.criarTelefone()]),
      endereco: this.fb.array([this.criarEndereco()]),
      formaPagamento: ['', Validators.required]
    });
  }

  criarTelefone(): FormGroup {
    return this.fb.group({
      codigoDeArea: ['', Validators.required],
      numero: ['', Validators.required]
    });
  }

  criarEndereco(): FormGroup {
    return this.fb.group({
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
    });
  }

  get telefones(): FormArray {
    return this.pedidoForm.get('telefone') as FormArray;
  }

  get enderecos(): FormArray {
    return this.pedidoForm.get('endereco') as FormArray;
  }

  adicionarTelefone(): void {
    this.telefones.push(this.criarTelefone());
  }

  adicionarEndereco(): void {
    this.enderecos.push(this.criarEndereco());
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
  
    // Obtém o usuário logado
    this.authService.getUsuarioLogado().subscribe((usuarioLogado) => {
      if (!usuarioLogado) {
        this.errorMessage = 'Erro ao obter informações do usuário logado.';
        return;
      }
  
      // Ajusta o endereço para corresponder ao tipo esperado
      const endereco = {
        idEndereco: 0, // Defina como 0 ou deixe o backend preencher
        cep: this.enderecos.getRawValue()[0].cep,
        logradouro: this.enderecos.getRawValue()[0].logradouro,
        complemento: this.enderecos.getRawValue()[0].complemento,
        bairro: this.enderecos.getRawValue()[0].bairro,
        municipio: {
          idMunicipio: 0,
          nome: this.enderecos.getRawValue()[0].municipio.nome,
          estado: {
            id: 0,
            nome: this.enderecos.getRawValue()[0].municipio.estado.nome,
            sigla: this.enderecos.getRawValue()[0].municipio.estado.sigla,
          },
        },
      };
  
      // Construindo o objeto 'pedido' com todas as propriedades obrigatórias
      const novoPedido = {
        id: 0, // Inicialize como 0 ou deixe que o backend gere
        usuario: usuarioLogado, // Usa o objeto do usuário
        endereco: endereco,
        telefone: this.telefones.getRawValue()[0], // Converte para o tipo Telefone
        itens: this.itensCarrinho,
        formaDePagamento: this.formaDePagamento?.label || '', // Comparação usando string (ajuste se for enum)
        quantidadeDeParcelas: this.formaDePagamento?.label === 'CARTAO' ? 1 : undefined,
        valorTotal: this.total,
        status: 'PENDENTE', // Status inicial do pedido
      };
  
      this.pedidoService.criarPedido(novoPedido).subscribe(
        (response: any) => {
          this.router.navigate(['/user/pedidos/new']);
        },
        (error: any) => {
          this.errorMessage = 'Erro ao finalizar o pedido.';
        }
      );
    });
  }
  
  cancelarPedido(): void {
    this.pedidoForm.reset();
    console.log('Pedido cancelado');
  }

}