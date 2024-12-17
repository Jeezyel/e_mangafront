import { Component, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';


@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  usuarioLogado!: Usuario;
  displayedColumns: string[] = ['id', 'nome', 'email', 'username', 'perfil', 'acao'];
  perfilFormatado: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregarUsuarioLogado();
  }

  carregarUsuarioLogado(): void {
    this.usuarioService.buscarUsuarioLogado().subscribe({
      next: (usuario) => {
        this.usuarioLogado = usuario;
        this.perfilFormatado = this.formatarPerfil(usuario.perfil);
      },
      error: (err) => console.error('Erro ao buscar usuário logado', err)
    });
  }

  formatarPerfil(perfil: string): string {
    return perfil === 'ADMIN' ? 'Administrador' : 'Usuário';
  }

  deletar(id: number): void {
    if (confirm('Tem certeza que deseja deletar sua conta?')) {
      console.log('Implementar lógica de exclusão de conta', id);
      // Implemente a chamada para o serviço de exclusão se necessário
    }
  }
}
