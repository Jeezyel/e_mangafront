import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';

import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';

@Component({
  selector: 'app-estado-list',
  standalone: true,
  imports: [MatPaginatorModule, NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './estado-list.component.html',
  styleUrls: ['./estado-list.component.css'] // Corrigi o nome para 'styleUrls'
})
export class EstadoListComponent implements OnInit {
  
  estados: Estado[] = [];
  displayedColumns: string[] = ['id', 'nome', 'sigla', 'acao'];

  // Variáveis para paginação
  totalRecords = 0;
  pageSize = 5;
  page = 0; 

  constructor(private estadoService: EstadoService) {}

  ngOnInit(): void {
    this.carregarEstados();
    this.contarEstados();
  }

  carregarEstados(): void {
    this.estadoService.findAll(this.page, this.pageSize).subscribe({
      next: (data) => {this.estados = data;},
      error: (err) => console.error("Erro ao carregar estados", err)
    });
  }

  contarEstados(): void {
    this.estadoService.count().subscribe({
      next:(data) => {this.totalRecords = data;},
      error: (err) => console.error("Erro ao contar estados", err)
    })
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarEstados();
  }

}

