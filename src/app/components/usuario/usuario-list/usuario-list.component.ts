import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  usuarioLogado?: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getLoggedUserId();
    const token = this.authService.getToken();
    if (userId && token) {
      this.usuarioService.getUsuarioById(userId, token).subscribe({
        next: (usuario) => {
          if (usuario) {
            this.usuarioLogado = usuario;
          } else {
            console.error('Nenhum usuário retornado.');
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao carregar usuário:', error);
        }
      });
    }
  }

  deletar(id: number | undefined): void {
    if (!id) {
      alert('Usuário inválido para exclusão.');
      return;
    }
    const token = this.authService.getToken();
    if (!token) {
      alert('Erro: Token de autenticação ausente.');
      return;
    }
    if (confirm('Tem certeza que deseja excluir sua conta?')) {
      this.usuarioService.deleteUsuario(id, token).subscribe({
        next: () => {
          alert('Conta excluída com sucesso!');
          this.usuarioLogado = undefined;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir conta:', error);
          alert('Erro ao excluir conta: ' + error.message);
        }
      });
    }
  }

}