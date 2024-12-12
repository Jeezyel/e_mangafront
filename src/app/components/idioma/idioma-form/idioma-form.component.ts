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

import { Idioma } from '../../../models/idioma.model';
import { IdiomaService } from '../../../services/idioma.service';

@Component({
  selector: 'app-idioma-form',
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
  templateUrl: './idioma-form.component.html',
  styleUrls: ['./idioma-form.component.css'] // Corrigi o nome para 'styleUrls'
})
export class IdiomaFormComponent {

  formGroup: FormGroup;

  constructor (
    private formBuilder: FormBuilder,
    private idiomaService: IdiomaService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      
    const idioma: Idioma = activatedRoute.snapshot.data['idioma'];
      
    this.formGroup = formBuilder.group({
      idIdioma: [(idioma && idioma.idIdioma) ? idioma.idIdioma : null],
      idioma: [(idioma && idioma.idioma) ? idioma.idioma: '',
              Validators.compose([Validators.required,Validators.minLength(4)])],
      sigla: [(idioma && idioma.sigla) ? idioma.sigla: '',
              Validators.compose([Validators.required,Validators.minLength(2)])],
    });
  }

  salvar() {
    
    const page = 0; // Página inicial
    const size = 10; // Número de itens por página

    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
        const idioma = this.formGroup.value;

        const operacao = idioma.idIdioma == null
        ? this.idiomaService.create(idioma) // Aqui você chama o método create
        : this.idiomaService.update(idioma);

        operacao.subscribe({
            next: () => {
              this.idiomaService.findAll(page,size);
              this.router.navigate(['/admin/idiomas'], { queryParams: { success: true } });
            },
            error: (error: HttpErrorResponse) => {
                console.log('Erro ao salvar: ', error);
                this.tratarErros(error);
            }
        });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const idioma = this.formGroup.value;
      if (idioma.idIdioma != null) {
        this.idiomaService.delete(idioma).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/idiomas');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
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
    idioma: {
      required: 'O nome do idioma deve ser informado.'
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