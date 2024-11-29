import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, senha } = this.loginForm.value;
  
      this.authService.login(username, senha, true).subscribe({
        next: (response) => {
          console.log('Login realizado com sucesso!', response);
  
          // Pegue o token do cabeçalho de autorização
          const token = response.headers.get('authorization');
          if (token) {
            // Armazene o token no localStorage ou sessionStorage
            localStorage.setItem('token', token);
            console.log('Token JWT armazenado com sucesso!');
          }
  
          // Redirecione ou realize outras ações
        },
        error: (err) => {
          console.error('Erro no login:', err);
          alert('Erro ao realizar login. Verifique as credenciais.');
        }
      });
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
  

  onRegister() {
    // criar usuário
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }
}