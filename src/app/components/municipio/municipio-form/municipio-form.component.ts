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

import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { Municipio } from '../../../models/municipio.model';
import { MunicipioService } from '../../../services/municipio.service';

@Component({
  selector: 'app-municipio-form',
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
  templateUrl: './municipio-form.component.html',
  styleUrls: ['./municipio-form.component.css'] // Corrigi o nome para 'styleUrls'
})
export class MunicipioFormComponent {

  formGroup: FormGroup;
  estados: Estado[] = [];

  constructor (
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private municipioService: MunicipioService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      
    const estado: Estado = activatedRoute.snapshot.data['estado'];
    const municipio: Municipio = activatedRoute.snapshot.data['municipio'];  
    
    this.formGroup = this.formBuilder.group({
      id: [(municipio && municipio.id) ? municipio.id : null],
      nome: [(municipio && municipio.nome) ? municipio.nome : null, 
              Validators.compose([Validators.required, Validators.minLength(4)])],
      estado: [estado]
    })

  }

  salvar() {
    
    const page = 0; // Página inicial
    const size = 10; // Número de itens por página

    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
        const municipio = this.formGroup.value;

        const operacao = municipio.id == null
        ? this.municipioService.create(municipio) // Aqui você chama o método create
        : this.municipioService.update(municipio);

        operacao.subscribe({
            next: () => {
              this.municipioService.findAll(page,size);
              this.router.navigate(['/municipios'], { queryParams: { success: true } });
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
    nome: {
      required: 'O nome do município deve ser informado.',
      minlength: 'O nome do município deve possuir ao menos 4 caracteres.'
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
