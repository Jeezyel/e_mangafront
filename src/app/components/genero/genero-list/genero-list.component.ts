import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Genero } from '../../../models/genero.model';
import { GeneroService } from '../../../services/genero.service';

@Component({
  selector: 'app-genero-list',
  standalone: true,
  imports: [
    NgFor, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTableModule, 
    RouterModule
  ],
  templateUrl: './genero-list.component.html',
  styleUrls: ['./genero-list.component.css'] // Corrigi o nome para 'styleUrls'
})
export class GeneroListComponent implements OnInit {
  
  generos: Genero[] = [];
  displayedColumns: string[] = ['idMangaGenero', 'genero', 'acao'];

  // Variáveis para paginação
  page: number = 0; // página atual
  size: number = 10; // número de itens por página

  constructor(private generoService: GeneroService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Verificar se a operação foi bem-sucedida
    this.route.queryParams.subscribe((params: Params) => {
      if (params['success']) {
        this.loadGeneros(this.page, this.size);
      }
    });
    this.loadGeneros(this.page, this.size);
  }

  loadGeneros(page: number, size: number): void {
    this.generoService.findAll(page, size).subscribe(
      data => { this.generos = data; },
      error => { console.error('Erro ao carregar generos', error); }
    );
  }

  deletar(idMangaGenero: number): void {
    if (confirm('Tem certeza que deseja excluir este genero?')) {
      this.generoService.delete(idMangaGenero).subscribe({
        next: () => this.loadGeneros(this.page, this.size), // Recarrega a lista após a exclusão
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir genero', error);
          alert('Erro ao excluir genero: ' + error.message);
        }
      });
    }
  }
}
