import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { HttpErrorResponse } from '@angular/common/http';

import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';

@Component({
  selector: 'app-estado-form',
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
    MatSelectModule
  ],
  templateUrl: './estado-form.component.html',
  styleUrls: ['./estado-form.component.css'] // Corrigi o nome para 'styleUrls'
})
export class EstadoFormComponent implements OnInit {

  formGroup: FormGroup;

  constructor (
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {    
    this.formGroup = formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      sigla: ['', Validators.required]
    });
  }

  ngOnInit(): void {
      this.initializeForm();
  }

  initializeForm(): void {
    const estado: Estado = this.activatedRoute.snapshot.data['estado'];

    this.formGroup = this.formBuilder.group({

      id: [(estado && estado.id) ? estado.id : null],
      nome: [(estado && estado.nome) ? estado.nome : null],
      sigla: [(estado && estado.sigla) ? estado.sigla : null]
    
    })
  }

  tratarErros(errorResponse: HttpErrorResponse) {

    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);

          if (formControl) {
            formControl.setErrors({apiError: validationError.message})
          }

        });
      }
    } else if (errorResponse.status < 400){
      alert(errorResponse.error?.message || 'Erro genérico do envio do formulário.');
    } else if (errorResponse.status >= 500) {
      alert('Erro interno do servidor.');
    }

  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const estado = this.formGroup.value;

      // selecionando a operacao (insert ou update)
      const operacao = estado.id == null
      ? this.estadoService.insert(estado)
      : this.estadoService.update(estado);

      // executando a operacao
      operacao.subscribe({
        next: () => this.router.navigateByUrl('/admin/estados'),
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
        }
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const estado = this.formGroup.value;
      if (estado.id != null) {
        this.estadoService.delete(estado).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/estados');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
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

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {

    nome: {
      required: 'O nome deve ser informado.',
      minlength: 'O nome deve conter ao menos 2 letras.',
      apiError: ' '
    },

    sigla: {
      required: 'A sigla deve ser informada.',
      minlength: 'O nome deve conter 2 letras.',
      maxlength: 'O nome deve conter 2 letras.',
      apiError: ' '
    }
  
  }

}