import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CurrencyPipe } from '@angular/common';

import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [MatPaginatorModule, NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, CurrencyPipe],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  mangas: Usuario[] = [];
  displayedColumns: 
  string[] = [
    'id', 
    'nome', 
    'email', 
    'telefone', 
    'endereco', 
    'perfil', 
    'username', 
    'senha',  
    'acao'
  ];

  // variaveis de controle para a paginacao
  totalRecords = 0;
  size = 10;
  page = 0;

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['success']) {
        this.loadMangas(this.page, this.size);
      }
    });
    this.loadMangas(this.page, this.size);
  }

  loadMangas(page:number, size:number): void {
    this.usuarioService.findAll(page, size).subscribe(
      data => { this.mangas = data; },
      error => { console.error('Erro ao carregar municípios', error); }
    );
  }

  deletar(id: number): void {
    if (confirm('Tem certeza que deseja excluir este município?')) {
      this.usuarioService.delete(id).subscribe({
        next: () => this.loadMangas(this.page,this.size), // Recarrega a lista após a exclusão
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir município', error);
          alert('Erro ao excluir município: ' + error.message);
        }
      });
    }
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.usuarioService.findAll(this.page, this.size).subscribe(
      data => { this.mangas = data; }
    );
  }  
}