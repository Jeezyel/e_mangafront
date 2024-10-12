import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Municipio } from '../../../models/municipio.model';
import { MunicipioService } from '../../../services/municipio.service';
import { EstadoService } from '../../../services/estado.service';
import { Estado } from '../../../models/estado.model';

@Component({
  selector: 'app-municipio-list',
  standalone: true,
  imports: [
    NgFor, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTableModule, 
    RouterModule
  ],
  templateUrl: './municipio-list.component.html',
  styleUrls: ['./municipio-list.component.css']
})
export class MunicipioListComponent implements OnInit {

  municipios: Municipio[] = [];
  displayedColumns: string[] = ['id', 'nome', 'estado','acao'];

  // Variáveis para paginação
  page: number = 0; // página atual
  size: number = 10; // número de itens por página

  constructor(private municipioService: MunicipioService
  ) {}

  ngOnInit(): void {
    this.loadMunicipios(this.page, this.size);
  }

  loadMunicipios(page:number, size:number): void {
    this.municipioService.findAll(page, size).subscribe(
      data => { this.municipios = data; },
      error => { console.error('Erro ao carregar municípios', error); }
    );
  }


  deletar(id: number): void {
    if (confirm('Tem certeza que deseja excluir este município?')) {
      this.municipioService.delete(id).subscribe({
        next: () => this.loadMunicipios(this.page,this.size), // Recarrega a lista após a exclusão
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir município', error);
          alert('Erro ao excluir município: ' + error.message);
        }
      });
    }
  }
}
