import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgIf } from '@angular/common';

import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      telefone: this.formBuilder.array([]),
      endereco: this.formBuilder.array([])
    });
  }


  get telefoneArray(): FormArray {
    return this.formGroup.get('telefone') as FormArray;
  }

  get enderecoArray(): FormArray {
    return this.formGroup.get('endereco') as FormArray;
  }

  addTelefone(): void {
    this.telefoneArray.push(this.formBuilder.control('', Validators.required));
  }

  removeTelefone(index: number): void {
    this.telefoneArray.removeAt(index);
  }

  addEndereco(): void {
    this.enderecoArray.push(this.formBuilder.control('', Validators.required));
  }

  removeEndereco(index: number): void {
    this.enderecoArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const token = this.authService.getToken();
      if(!token){
        alert('Erro: Token de autenticação ausente.');
        this.router.navigate(['/login']);
        return;
      }
      this.usuarioService.createUsuario(this.formGroup.value, token).subscribe(
        () => {
          alert('Usuário criado com sucesso!');
          this.router.navigate(['/usuario']);
        },
        (error) => {
          console.error('Erro ao criar usuário', error);
          alert('Erro ao criar usuário. Tente novamente.');
        }
      );
    }
  }

  cancelar(): void {
    this.router.navigate(['/usuario']); // Redireciona para a página de usuários
  }

}