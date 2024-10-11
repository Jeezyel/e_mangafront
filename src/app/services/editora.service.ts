import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Editora } from '../models/editora.model';

@Injectable({
    providedIn: 'root'
  })
  export class EditoraService {
    private baseUrl = 'http://localhost:8080/editoras';
  
    constructor(private httpClient: HttpClient) {}
  
    //A paginação fica aqui
    findAll(): Observable<Editora[]> {
      return this.httpClient.get<Editora[]>(`${this.baseUrl}`);
    }
  
    findById(idEditora: number): Observable<Editora> {
      return this.httpClient.get<Editora>(`${this.baseUrl}/${idEditora}`); 
    }
  
    create(editora: Editora): Observable<Editora> {
      return this.httpClient.post<Editora>(`${this.baseUrl}/insert`, editora);
    }
  
    update(editora: Editora): Observable<Editora> {
      return this.httpClient.put<Editora>(`${this.baseUrl}/update/${editora.idEditora}`, editora); 
    }
  
    delete(idEditora: number): Observable<void>{
      return this.httpClient.delete<void>(`${this.baseUrl}/delete/${idEditora}`); 
    }
  
    // Método para contar o total de registros (usado para a paginação)
    count(): Observable<number> {
      return this.httpClient.get<number>(`${this.baseUrl}/count`);
    }
  
  }