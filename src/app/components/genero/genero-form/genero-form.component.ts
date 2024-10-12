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

import { Genero } from '../../../models/genero.model';
import { GeneroService } from '../../../services/genero.service';

@Component({
  selector: 'app-genero-form',
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
  templateUrl: './genero-form.component.html',
  styleUrls: ['./genero-form.component.css'] // Corrigi o nome para 'styleUrls'
})
export class GeneroFormComponent {

  formGroup: FormGroup;

  constructor (
    private formBuilder: FormBuilder,
    private generoService: GeneroService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      
    const genero: Genero = activatedRoute.snapshot.data['genero'];
      
    this.formGroup = formBuilder.group({ 
      idMangaGenero: [(genero && genero.idMangaGenero) ? genero.idMangaGenero : null],
      genero: [(genero && genero.genero) ? genero.genero: '',
              Validators.compose([Validators.required])]
    });
  }

  salvar() {
    
    const page = 0; // Página inicial
    const size = 10; // Número de itens por página

    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
        const genero = this.formGroup.value;

        const operacao = genero.idMangaGenero == null
        ? this.generoService.create(genero) // Aqui você chama o método create
        : this.generoService.update(genero);

        operacao.subscribe({
            next: () => {
              this.generoService.findAll(page,size);
              this.router.navigate(['/generos'], { queryParams: { success: true } });
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
    genero: {
      required: 'O genero do genero deve ser informado.'
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