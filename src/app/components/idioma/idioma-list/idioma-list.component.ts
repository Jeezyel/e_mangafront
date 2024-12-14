import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Idioma } from '../../../models/idioma.model';
import { IdiomaService } from '../../../services/idioma.service';

@Component({
  selector: 'app-idioma-list',
  standalone: true,
  imports: [
    MatPaginatorModule,
    NgFor, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTableModule, 
    RouterModule
  ],
  templateUrl: './idioma-list.component.html',
  styleUrls: ['./idioma-list.component.css'] // Corrigi o nome para 'styleUrls'
})
export class IdiomaListComponent implements OnInit {
  
  idiomas: Idioma[] = [];
  displayedColumns: string[] = ['idIdioma', 'idioma', 'sigla', 'acao'];

  // Variáveis para paginação
  totalRecords = 0;
  size = 10;
  page = 0;

  constructor(private idiomaService: IdiomaService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Verificar se a operação foi bem-sucedida
    this.route.queryParams.subscribe((params: Params) => {
      if (params['success']) {
        this.loadIdiomas(this.page, this.size);
      }
    });
    this.loadIdiomas(this.page, this.size);
    this.idiomaService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  loadIdiomas(page: number, size: number): void {
    this.idiomaService.findAll(page, size).subscribe(
      data => { this.idiomas = data; },
      error => { console.error('Erro ao carregar idiomas', error); }
    );
  }

  deletar(idIdioma: number): void {
    if (confirm('Tem certeza que deseja excluir este idioma?')) {
      this.idiomaService.delete(idIdioma).subscribe({
        next: () => this.loadIdiomas(this.page, this.size), // Recarrega a lista após a exclusão
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir idioma', error);
          alert('Erro ao excluir idioma: ' + error.message);
        }
      });
    }
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.ngOnInit();
  } 
}

