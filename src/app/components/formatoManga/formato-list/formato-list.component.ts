import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Formato } from '../../../models/formato.model';
import { FormatoService } from '../../../services/formato.service';

@Component({
  selector: 'app-formato-list',
  standalone: true,
  imports: [
    NgFor, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTableModule, 
    RouterModule
  ],
  templateUrl: './formato-list.component.html',
  styleUrls: ['./formato-list.component.css'] // Corrigi o nome para 'styleUrls'
})
export class FormatoListComponent implements OnInit {
  
  formatos: Formato[] = [];
  displayedColumns: string[] = ['idFormato', 'formato', 'acao'];

  // Variáveis para paginação
  totalRecords = 0;
  page: number = 0; // página atual
  size: number = 10; // número de itens por página

  constructor(private formatoService: FormatoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Verificar se a operação foi bem-sucedida
    this.route.queryParams.subscribe((params: Params) => {
      if (params['success']) {
        this.loadFormatos(this.page, this.size);
      }
    });
    this.loadFormatos(this.page, this.size);
  }

  loadFormatos(page: number, size: number): void {
    this.formatoService.findAll(page, size).subscribe(
      data => { this.formatos = data; },
      error => { console.error('Erro ao carregar formato', error); }
    );
  }

  deletar(idFormato: number): void {
    if (confirm('Tem certeza que deseja excluir este formato?')) {
      this.formatoService.delete(idFormato).subscribe({
        next: () => this.loadFormatos(this.page, this.size), // Recarrega a lista após a exclusão
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir formato', error);
          alert('Erro ao excluir formato: ' + error.message);
        }
      });
    }
  }
}

