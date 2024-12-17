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
    private route: ActivatedRoute 
  ) { }

  ngOnInit(): void {
    // Obter o perfil da URL
    this.route.queryParams.subscribe((params: Params) => {
      this.perfil = params['perfil'] || 'USER';
    });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      
      const username = this.loginForm.get('username')?.value;
      const senha = this.loginForm.get('senha')?.value;

      const login = this.perfil === 'ADMIN' ? 'loginADM' : 'loginUSER';

      this.authService[login](username, senha).subscribe({
        next: () => {

          // Buscar o usuário logado do AuthService
          const usuarioLogado = this.authService['usuarioLogadoSubject'].value;
          console.log("Usuário logado no login.component:", usuarioLogado);

          if (!usuarioLogado) {
            this.showSnackbarTopPosition('Erro ao buscar dados do usuário.');
            return;
          }
          // Redirecionamento baseado no perfil
          const perfil = usuarioLogado.perfil;
          if (perfil === 'ADMIN') {
            this.router.navigateByUrl('/admin');
          } else if (perfil === 'USER') {
            this.router.navigateByUrl('/user');
          } else {
          this.showSnackbarTopPosition('Perfil inválido. Entre em contato com o suporte.');
          }
        },
        error: () => {
          this.showSnackbarTopPosition("Username ou senha inválido");
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