import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Editora } from '../../../models/editora.model';
import { EditoraService } from '../../../services/editora.service';

@Component({
  selector: 'app-editora-list',
  standalone: true,
  imports: [
    NgFor, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTableModule, 
    RouterModule
  ],
  templateUrl: './editora-list.component.html',
  styleUrls: ['./editora-list.component.css'] // Corrigi o nome para 'styleUrls'
})
export class EditoraListComponent implements OnInit {
  
  editoras: Editora[] = [];
  displayedColumns: string[] = ['idEditora', 'nome', 'cnpj', 'telefone', 'acao'];

  constructor(private editoraService: EditoraService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Verificar se a operação foi bem-sucedida
    this.route.queryParams.subscribe((params: Params) => {
      if (params['success']) {
        this.loadEditoras();
      }
    });
    this.loadEditoras();
  }

  loadEditoras(): void {
    this.editoraService.findAll(0, 100).subscribe(
      data => { this.editoras = data; },
      error => { console.error('Erro ao carregar editora', error); }
    );
  }

  deletar(idEditora: number): void {
    console.log('Tentando excluir editora com ID:', idEditora); // Verifique o ID
    if (confirm('Tem certeza que deseja excluir esta editora?')) {
      this.editoraService.delete(idEditora).subscribe({
        next: () => this.loadEditoras(), // Recarrega a lista após a exclusão
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir editora', error);
          alert('Erro ao excluir editora: ' + error.message);
        }
      });
    }
  }
}