import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSelectModule} from '@angular/material/select';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

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
    MatSelectModule],
  templateUrl: './municipio-form.component.html',
  styleUrls: ['./municipio-form.component.css'] // Corrigi o nome para 'styleUrls'
})
export class MunicipioFormComponent implements OnInit {

  formGroup: FormGroup;
  estados: Estado[] = [];

  constructor (
    private formBuilder: FormBuilder,
    private municipioService: MunicipioService,
    private estadoService: EstadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      estado: [null]
    })
  
  }
    
  ngOnInit(): void {
    this.estadoService.findAll().subscribe(data=> {
      this.estados = data;
      this.initializeForm();
    })
  }

  initializeForm(): void {
    
    const municipio: Municipio = this.activatedRoute.snapshot.data['municipio'];
    const estado = this.estados.find(estado => estado.id === (municipio?.estado?.id || null));

    this.formGroup = this.formBuilder.group({
      id: [(municipio && municipio.idMunicipio) ? municipio.idMunicipio : null],
      nome: [(municipio && municipio.nome) ? municipio.nome : null, 
              Validators.compose([Validators.required, Validators.minLength(4)])],
      estado: [estado]
    })
  
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const municipio = this.formGroup.value;
      if (municipio.idMunicipio ==null) {
        this.municipioService.create(municipio).subscribe({
          next: (municipioCadastrado) => {
            this.router.navigateByUrl('/admin/municipios');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.municipioService.update(municipio).subscribe({
          next: (municipioAlterado) => {
            this.router.navigateByUrl('/admin/municipios');
          },
          error: (err) => {
            console.log('Erro ao Editar' + JSON.stringify(err));
          }
        });
      }
    } else {
      console.log("Formulário inválido.")
    }
  }

  deletar() {
    if (this.formGroup.valid) {
      const municipio = this.formGroup.value;
      if (municipio.idMunicipio != null) {
        this.municipioService.delete(municipio).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/municipios');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }
  
  getErrorMessage(controlName : string, errors: ValidationErrors | null | undefined): string {
    if (!errors){
      return '';
    }
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessages[controlName][errorName]){
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'invalid field';
  }
  
  errorMessages: {[controlName: string]: {[errorName: string] : string}} = {
    nome: {
      required: 'O nome do município deve ser informado.',
      minlength: 'O nome do município deve possuir ao menos 4 caracteres.'
    }
  }
  
}
