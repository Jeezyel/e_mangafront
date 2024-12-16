import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Perfil } from '../../models/perfil.model';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule, MatSelectModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  perfil: string = 'USER';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private activattedRoute: ActivatedRoute,
    private carrinhoService: CarrinhoService 
  ) { }

  ngOnInit(): void {
    // limpar carrinho
    this.carrinhoService.removerTudo();

    // deslogar
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      senha: ['', Validators.required]
    });

    // pegar do login-selection
    const state = history.state;
    if (state && state.perfil) {
      this.perfil = state.perfil;
    }
  }

  onSubmit() {

    if (this.loginForm.valid) {

      const username = this.loginForm.get('username')?.value;
      const senha = this.loginForm.get('senha')?.value;
  
      this.authService.login(username, senha, this.perfil).subscribe({
        next: (resp) => {
          if(this.perfil === 'ADMIN') {
            this.router.navigateByUrl('/admin');
          } else if (this.perfil === 'USER') {
            this.router.navigateByUrl('/user');
          }
        },
        error: (err) => {
          if (err.status === 404) {
            // Username não encontrado
            const snackBarRef = this.snackBar.open(
              "Usuário não encontrado. Deseja se cadastrar?",
              "Cadastrar",
              {
                duration: 5000,
                verticalPosition: "top",
                horizontalPosition: "center",
              }
            );
  
            // Redireciona para a tela de cadastro ao clicar no botão 'Cadastrar'
            snackBarRef.onAction().subscribe(() => {
              this.onRegister();
            });
          } else {
            // Outros erros, como senha inválida
            this.showSnackbarTopPosition("Username ou senha inválido");
          }
        }
      });
    } else {
      this.showSnackbarTopPosition('Preencha todos os campos corretamente.');
    }
  }
  
  onRegister() {
    this.router.navigate(['/usuario/new']);
  }
  
  showSnackbarTopPosition(content: string) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }
  
}