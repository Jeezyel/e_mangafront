import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

import { Endereco } from '../../../models/endereco.model';
import { EnderecoService } from '../../../services/endereco.service';
import { Municipio } from '../../../models/municipio.model';
import { MunicipioService } from '../../../services/municipio.service';

@Component({
  selector: 'app-endereco-form',
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
    CommonModule
  ],
  templateUrl: './endereco-form.component.html',
  styleUrls: ['./endereco-form.component.css'] // Corrigi o nome para 'styleUrls'
})
export class EnderecoFormComponent implements OnInit {

  formGroup: FormGroup;
  municipios: Municipio[] = [];

  constructor (
    private formBuilder: FormBuilder,
    private municipioService: MunicipioService,
    private enderecoService: EnderecoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {    
    const municipio: Municipio = activatedRoute.snapshot.data['municipio'];
    const endereco: Endereco = activatedRoute.snapshot.data['endereco'];  
    
    this.formGroup = this.formBuilder.group({
      idEndereco: [(endereco && endereco.idEndereco) ? endereco.idEndereco : null],
      cep: [(endereco && endereco.cep) ? endereco.cep : null],
      logradouro: [(endereco && endereco.logradouro) ? endereco.logradouro : null, 
              Validators.compose([Validators.required, Validators.minLength(4)])
            ],
      complemento: [(endereco && endereco.complemento) ? endereco.complemento : null, 
              Validators.compose([Validators.required, Validators.minLength(4)])
            ],
      bairro: [(endereco && endereco.bairro) ? endereco.bairro : null, 
              Validators.compose([Validators.required, Validators.minLength(4)])
            ],
      municipio: [(municipio) ? { id: municipio.idMunicipio, nome: municipio.nome} : null] 
    });
  }

  ngOnInit(): void {
    this.getMunicipioForSelect(); // Carrega a lista de estados ao inicializar
  }

  getMunicipioForSelect(): void{
    this.municipioService.findAll(0, 100).subscribe({
      next: (data) => {
        console.log('Municipios carregados:', data); // Verifica os estados carregados.
        this.municipios = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar municipios:', error);
      }
    });
  }

  salvar(): void {
    const page = 0; // Página inicial
    const size = 10; // Número de itens por página

    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
        const endereco = this.formGroup.value;

        // Determina se é criação ou atualização com base na presença de idEndereco
        const operacao = endereco.idEndereco == null
            ? this.enderecoService.create({
                  cep: endereco.cep,
                  logradouro: endereco.logradouro,
                  complemento: endereco.complemento,
                  bairro: endereco.bairro,
                  idMunicipio: endereco.municipio.idMunicipio, // Apenas ID para criação
              }) // Método create
            : this.enderecoService.update({
                  idEndereco: endereco.idEndereco,
                  cep: endereco.cep,
                  logradouro: endereco.logradouro,
                  complemento: endereco.complemento,
                  bairro: endereco.bairro,
                  municipio: {
                    idMunicipio: endereco.municipio.idMunicipio,
                    nome: endereco.municipio.nome, // Nome do município
                    estado: endereco.municipio.estado, // Estado do município
                  }, // Objeto para update
              }); // Método update

        // Executa a operação (create ou update)
        operacao.subscribe({
            next: () => {
                this.enderecoService.findAll(page, size); // Atualiza a listagem
                this.router.navigate(['/admin/enderecos'], { queryParams: { success: true } });
            },
            error: (error: HttpErrorResponse) => {
                console.log('Erro ao salvar: ', error);
                this.tratarErros(error);
            }
        });
    }
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

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    logradouro: {
      required: 'O nome do logradouro deve ser informado.',
      minlength: 'O nome do logradouro deve possuir ao menos 4 caracteres.'
    },
    complemento: {
      required: 'O nome do logradouro deve ser informado.',
      minlength: 'O nome do logradouro deve possuir ao menos 4 caracteres.'
    },
    bairro: {
      required: 'O nome do logradouro deve ser informado.',
      minlength: 'O nome do logradouro deve possuir ao menos 4 caracteres.'
    }
  };

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }

    return 'Erro não mapeado (entre em contato com o desenvolvedor)';
  }

}

