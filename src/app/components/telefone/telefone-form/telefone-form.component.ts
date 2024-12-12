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

import { Telefone } from '../../../models/telefone.model';
import { TelefoneService } from '../../../services/telefone.service';

@Component({
  selector: 'app-telefone-form',
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
  templateUrl: './telefone-form.component.html',
  styleUrls: ['./telefone-form.component.css'] // Corrigi o codegodearea para 'styleUrls'
})
export class TelefoneFormComponent {

  formGroup: FormGroup;

  constructor (
    private formBuilder: FormBuilder,
    private telefoneService: TelefoneService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      
    const telefone: Telefone = activatedRoute.snapshot.data['telefone'];
      
    this.formGroup = formBuilder.group({
      idTelefone: [(telefone && telefone.idTelefone) ? telefone.idTelefone : null],
      codegoDeArea: [(telefone && telefone.codegoDeArea) ? telefone.codegoDeArea: '',
              Validators.compose([Validators.required,Validators.maxLength(2)])],
      numero: [(telefone && telefone.numero) ? telefone.numero: '',
              Validators.compose([Validators.required,Validators.maxLength(9)])],
    });
  }

  salvar() {
    
    const page = 0; // Página inicial
    const size = 10; // Número de itens por página

    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
        const telefone = this.formGroup.value;

        const operacao = telefone.idTelefone == null
        ? this.telefoneService.create(telefone) // Aqui você chama o método create
        : this.telefoneService.update(telefone);

        operacao.subscribe({
            next: () => {
              this.telefoneService.findAll(page,size);
              this.router.navigate(['/telefones'], { queryParams: { success: true } });
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
    codegodearea: {
      required: 'O código de área do telefone deve ser informado.',
      maxlength: 'O código de área do telefone deve possuir 2 caracteres.'
    },
    numero: {
      required: 'O número do telefone deve ser informado.',
      maxlength: 'O número do telefone deve possuir 9 caracteres.'
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