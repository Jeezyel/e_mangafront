import { Component } from '@angular/core';
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

import { Editora } from '../../../models/editora.model';
import { EditoraService } from '../../../services/editora.service';

@Component({
  selector: 'app-editora-form',
  standalone: true,
  imports: [
    NgIf, 
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule, 
    MatCardModule, 
    MatToolbarModule, 
    RouterModule
  ],
  templateUrl: './editora-form.component.html',
  styleUrls: ['./editora-form.component.css'] // Corrigi o nome para 'styleUrls'
})
export class EditoraFormComponent {

  formGroup: FormGroup;

  constructor (
    private formBuilder: FormBuilder,
    private editoraService: EditoraService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      
    const editora: Editora = activatedRoute.snapshot.data['editora'];
      
    this.formGroup = formBuilder.group({
      idEditora: [(editora && editora.idEditora) ? editora.idEditora : null],
      nome: [(editora && editora.nome) ? editora.nome: '',
        Validators.compose([Validators.required])],
      cnpj: [(editora && editora.cnpj) ? editora.cnpj: '',
        Validators.compose([Validators.required,Validators.minLength(18)])],
      telefone: [(editora && editora.telefone) ? editora.telefone: '',
        Validators.compose([Validators.required])],
    });
  }

  salvar() {
    
    const page = 0; // Página inicial
    const size = 10; // Número de itens por página

    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
        const editora = this.formGroup.value;

        const operacao = editora.idEditora == null
        ? this.editoraService.create(editora) // Aqui você chama o método create
        : this.editoraService.update(editora);

        operacao.subscribe({
            next: () => {
              this.editoraService.findAll(0, 100);
              this.router.navigate(['/editoras'], { queryParams: { success: true } });
            },
            error: (error: HttpErrorResponse) => {
                console.log('Erro ao salvar: ', error);
                this.tratarErros(error);
            }
        });
    }
  }

  tratarErros(error: HttpErrorResponse) {
    if (error.status === 400) {
      if (error.error?.errors) {
        error.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({ apiError: validationError.message });
          }
        });
      }
    } else if (error.status < 400) {
      alert(error.error?.message || 'Erro genérico no envio do formulário.');
    } else if (error.status >= 500) {
      alert('Erro interno do servidor. Por favor, tente novamente mais tarde.');
    }
  }

  errorMessages: {[controlName: string]: {[errorName: string] : string}} = {
    cnpj: {
      required: 'O CNPJ da editora deve ser informada.',
      minlength: 'O CNPJ da editora deve possuir ao menos 18 caracteres.'
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && 
          this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }

    return 'Erro não mapeado (entre em contato com o desenvolvedor)';
  }

}