import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../services/auth.service';
import { Usuario} from '../../../models/usuario.model';
import { Perfil } from '../../../models/perfil.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule, 
    RouterModule,
  ],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  usuarioLogado?: Usuario;
  displayedColumns: string[] = ['id', 'nome', 'email', 'username', 'perfil', 'acao'];
  perfilFormatado: string = ''; // Singular, ajustado para o modelo
  
  // Variáveis para paginação
  totalRecords = 0;
  size = 10;
  page = 0;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getLoggedUserId();
    if (userId) {
      this.usuarioService.findById(userId).subscribe((usuario) => {
        this.usuarioLogado = usuario;

        this.perfilFormatado = usuario.perfil
        ?.map((perfil: Perfil) => perfil.label) // Extrai os labels
        .join(', ') || 'Sem perfil'; // Junta os labels em uma string
      });
    }
  }

  deletar(id: number | undefined): void {

    if (!id) {
      alert('Usuário inválido para exclusão.');
      return;
    }
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.delete(id).subscribe({
        next: () => {
          alert('Usuário excluído com sucesso!');
          this.usuarioLogado = undefined;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir usuário', error);
          alert('Erro ao excluir usuário: ' + error.message);
        }
      });
    }
  }
}