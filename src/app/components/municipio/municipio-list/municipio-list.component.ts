import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Municipio } from '../../../models/municipio.model';
import { MunicipioService } from '../../../services/municipio.service';

@Component({
  selector: 'app-municipio-list',
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
  templateUrl: './municipio-list.component.html',
  styleUrls: ['./municipio-list.component.css']
})
export class MunicipioListComponent implements OnInit {

  municipios: Municipio[] = [];
  displayedColumns: string[] = ['id', 'nome', 'estado','acao'];

  // Variáveis para paginação
  totalRecords = 0;
  size = 10;
  page = 0;

  constructor(private municipioService: MunicipioService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['success']) {
        this.loadMunicipios(this.page, this.size);
      }
    });
    this.loadMunicipios(this.page, this.size);
    this.municipioService.count().subscribe(
      data => { this.totalRecords = data }
    );
  }

  loadMunicipios(page:number, size:number): void {
    this.municipioService.findAll(page, size).subscribe(
      data => { this.municipios = data; },
      error => { console.error('Erro ao carregar municípios', error); }
    );
  }

  deletar(idMunicipio: number): void {
    if (confirm('Tem certeza que deseja excluir este município?')) {
      this.municipioService.delete(idMunicipio).subscribe({
        next: () => this.loadMunicipios(this.page,this.size), // Recarrega a lista após a exclusão
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
      this.ngOnInit();
    } 
}
