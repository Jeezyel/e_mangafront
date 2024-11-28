import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { Municipio } from '../../../models/municipio.model';
import { MunicipioService } from '../../../services/municipio.service';

@Component({
  selector: 'app-municipio-list',
  standalone: true,
  imports: [
    NgFor, 
    MatTableModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    RouterModule],
  templateUrl: './municipio-list.component.html',
  styleUrls: ['./municipio-list.component.css']
})
export class MunicipioListComponent implements OnInit {

  municipios: Municipio[] = [];
  displayedColumns: string[] = ['id', 'nome', 'estado','acao'];

  constructor(private municipioService: MunicipioService) {}

  ngOnInit(): void {
      this.municipioService.findAll().subscribe(data =>{
        this.municipios = data;
      })
  }

}
