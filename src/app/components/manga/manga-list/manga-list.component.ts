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

import { Manga } from '../../../models/manga.model';
import { MangaService } from '../../../services/manga.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manga-list',
  standalone: true,
  imports: [MatPaginatorModule, NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule, CurrencyPipe],
  templateUrl: './manga-list.component.html',
  styleUrls: ['./manga-list.component.css']
})
export class MangaListComponent implements OnInit {
  mangas: Manga[] = [];
  displayedColumns: 
  string[] = [
    'idManga', 
    'nome', 
    'valor', 
    'editora', 
    'genero', 
    'formato', 
    'idioma', 
    'classificacaoIndicativa', 
    'estoque', 
    'acao'
  ];

  // variaveis de controle para a paginacao
  totalRecords = 0;
  size = 10;
  page = 0;

  constructor(private mangaService: MangaService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['success']) {
        this.loadMangas(this.page, this.size);
      }
    });
    this.loadMangas(this.page, this.size);
  }

  loadMangas(page:number, size:number): void {
    this.mangaService.findAll(page, size).subscribe(
      data => { this.mangas = data; },
      error => { console.error('Erro ao carregar municípios', error); }
    );
  }

  deletar(idManga: number): void {
    if (confirm('Tem certeza que deseja excluir este município?')) {
      this.mangaService.delete(idManga).subscribe({
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
    this.mangaService.findAll(this.page, this.size).subscribe(
      data => { this.mangas = data; }
    );
  }  
}
