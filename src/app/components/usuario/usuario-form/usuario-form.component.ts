import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm!: FormGroup;
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("iniciando a pagina")
    this.verificarPerfilAdmin();
    this.inicializarFormulario();
  }

  verificarPerfilAdmin(): void {
    console.log("fazendo a validação")

    const usuarioLogado = JSON.parse(localStorage.getItem('usuario_logado') || '{}');
    this.isAdmin = usuarioLogado.perfil === 'ADMIN';
  }

  inicializarFormulario(): void {
    console.log("iniciando o forme")

    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      perfil: [{ value: 'USER', disabled: !this.isAdmin }, Validators.required],
      telefone: this.fb.array([this.criarTelefone()]),
      endereco: this.fb.array([this.criarEndereco()])
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
    return this.usuarioForm.get('telefone') as FormArray;
  }

  get enderecos(): FormArray {
    return this.usuarioForm.get('endereco') as FormArray;
  }

  adicionarTelefone(): void {
    this.telefones.push(this.criarTelefone());
  }

  adicionarEndereco(): void {
    this.enderecos.push(this.criarEndereco());
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const usuario = this.usuarioForm.getRawValue();
      usuario.perfil = this.isAdmin ? usuario.perfil : 'USER';

      this.usuarioService.create2(usuario).subscribe({
        next: () => {
          alert('Usuário salvo com sucesso!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erro ao salvar usuário:', err);
          alert('Falha ao cadastrar usuário.');
        }
      });
    }
  }
  salvar(): void{
    console.log("salva")

    if (true) {
      console.log("if")
      const usuario = this.usuarioForm.getRawValue();
      usuario.perfil = this.isAdmin ? usuario.perfil : 'USER';

      this.usuarioService.create2(usuario).subscribe({
        next: () => {
          alert('Usuário salvo com sucesso!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erro ao salvar usuário:', err);
          alert('Falha ao cadastrar usuário.');
        }
      });
    }
  }
}
