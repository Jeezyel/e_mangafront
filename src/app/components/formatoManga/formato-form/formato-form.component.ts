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

import { Formato } from '../../../models/formato';
import { FormatoService } from '../../../services/formato.service';

@Component({
  selector: 'app-formato-form',
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
  templateUrl: './formato-form.component.html',
  styleUrls: ['./formato-form.component.css'] // Corrigi o nome para 'styleUrls'
})
export class FormatoFormComponent {

  formGroup: FormGroup;

  constructor (
    private formBuilder: FormBuilder,
    private formatoService: FormatoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      
    const formato: Formato = activatedRoute.snapshot.data['formato'];
      
    this.formGroup = formBuilder.group({
      idFormato: [(formato && formato.idFormato) ? formato.idFormato : null],
      formato: [(formato && formato.formato) ? formato.formato: '',
              Validators.compose([Validators.required])],
    });
  }

  salvar() {
    
    const page = 0; // Página inicial
    const size = 10; // Número de itens por página

    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
        const formato = this.formGroup.value;

        const operacao = formato.idFormato == null
        ? this.formatoService.create(formato) // Aqui você chama o método create
        : this.formatoService.update(formato);

        operacao.subscribe({
            next: () => {
              this.formatoService.findAll(page,size);
              this.router.navigate(['/formatos'], { queryParams: { success: true } });
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
    formato: {
      required: 'O nome do formato deve ser informado.'
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