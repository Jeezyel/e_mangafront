import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { Location, NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { Endereco } from '../../../models/endereco.model';
import { EnderecoService } from '../../../services/endereco.service';
import { Telefone } from '../../../models/telefone.model';
import { TelefoneService } from '../../../services/telefone.service';
import { Perfil } from '../../../models/perfil.model';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    NgIf, 
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule, 
    MatCardModule, 
    MatToolbarModule,
    RouterModule, 
    MatSelectModule, 
    MatIconModule
  ],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  
  id: number = 0;
  formGroup: FormGroup;

  telefones: Telefone [] = [];
  enderecos: Endereco [] = [];
  perfils: Perfil[] = [];
  
  constructor( 
    private formBuilder: FormBuilder,

    private usuarioService: UsuarioService,
    private telefoneService: TelefoneService,
    private enderecoService: EnderecoService,
    
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    const usuario: Usuario = activatedRoute.snapshot.data['usuario'];
    const editora: Telefone = activatedRoute.snapshot.data['telefone'];
    const genero: Endereco = activatedRoute.snapshot.data['endereco'];
    const perfil: Perfil = activatedRoute.snapshot.data['perfil'];
    
    this.formGroup = this.formBuilder.group({
      id: [usuario?.id || null],
      nome: [usuario?.nome || null, [Validators.required]],
      email: [usuario?.email || null, [Validators.required]],
      telefone: [Array.isArray(usuario?.telefone) 
        ? usuario.telefone.map((t: Telefone) => t.idTelefone) 
        : [usuario?.telefone?.idTelefone],[Validators.required]],
      endereco: [Array.isArray(usuario?.endereco) 
        ? usuario.endereco.map((e: Endereco) => e.idEndereco) 
        : [usuario?.endereco?.idEndereco],[Validators.required]],  
      perfil: [usuario?.perfil?.label || null, [Validators.required]],
      username: [usuario?.username || null, [Validators.required]],
      senha: [usuario?.senha || null, [Validators.required]]
  });
  }

  ngOnInit(): void {
    this.getTelefoneForSelect(),
    this.getEnderecoForSelect(),
    this.usuarioService.findPerfil().subscribe(data => {
      this.perfils = data;
    });
  }

  getTelefoneForSelect(): void{
    this.telefoneService.findAll(0, 100).subscribe({
      next: (data) => {
        console.log('Telefones carregados:', data); // Verifica os estados carregados.
        this.telefones = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar telefones:', error);
      }
    });
  }

  getEnderecoForSelect(): void{
    this.enderecoService.findAll(0, 100).subscribe({
      next: (data) => {
        console.log('Enderecos carregados:', data); // Verifica os estados carregados.
        this.enderecos = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar generos:', error);
      }
    });
  }

  salvar(): void {

    const page = 0; // Página inicial
    const size = 10; // Número de itens por página
    
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
        const usuario = this.formGroup.value;

        const data = {
            id: usuario.id || null,
            nome: usuario.nome,
            email: usuario.email,
            telefone: Array.isArray(usuario.telefone) 
              ? usuario.telefone.map((t: any)=>t.idTelefone) 
              : [usuario.telefone?.idTelefone], // Telefone como array
            endereco: Array.isArray(usuario.endereco) 
              ? usuario.endereco.map((e: any)=>e.idEndereco) 
              : [usuario.endereco?.idEndereco], // Endereco como array
            perfil: usuario.perfil?.label, // ID da classificação indicativa
            username: usuario.username,
            senha: usuario.senha
        };

        console.log('Payload enviado:', data);

        const operacao = usuario.id == null
            ? this.usuarioService.create(data)
            : this.usuarioService.update({ ...data, id: usuario.id });

        operacao.subscribe({
            next: () => {
                this.usuarioService.findAll(page, size); // Atualiza a listagem
                this.router.navigate(['/admin/usuarios'], { queryParams: { success: true } });
            },
            error: (error: HttpErrorResponse) => {
                console.error('Erro ao salvar:', error);
                this.tratarErros(error);
            }
        });
    }
  }
  
  voltarPagina() {
    this.location.back();
  }

  tratarErros(error: HttpErrorResponse): void {
    if (error.status === 400 && error.error?.errors) {
      error.error.errors.forEach((validationError: any) => {
        const formControl = this.formGroup.get(validationError.fieldName);
        if (formControl) {
          formControl.setErrors({ apiError: validationError.message });
        }
      });
    } else if (error.status < 400) {
      alert(error.error?.message || 'Erro genérico no envio do formulário.');
    } else if (error.status >= 500) {
      alert('Erro interno do servidor. Por favor, tente novamente mais tarde.');
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const usuario = this.formGroup.value;
      if (usuario.id != null) {
        this.usuarioService.delete(usuario).subscribe({
          next: () => {
            this.router.navigateByUrl('/usuarios');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado.',
      minlength: 'O nome deve conter ao menos 2 letras.',
      maxlength: 'O nome deve conter no máximo 10 letras.',
      apiError: ' '
    },
    email: {
      required: 'A descricao deve ser informada.',
      apiError: ' '
    },
    telefone: {
      required: 'A descricao deve ser informada.',
      apiError: ' '
    },
    endereco: {
      required: 'A descricao deve ser informada.',
      apiError: ' '
    },
    perfil: {
      required: 'A descricao deve ser informada.',
      apiError: ' '
    },
    username: {
      required: 'O estoque deve ser informado.',
      apiError: ' '
    },
    senha: {
      required: 'A descricao deve ser informada.',
      apiError: ' '
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }

    return 'invalid field';
  }

}
