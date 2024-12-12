import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Manga } from '../models/manga.model';
import { ClassificacaoIndicativa } from '../models/classificacao-indicativa.model';

@Injectable({
  providedIn: 'root'
})
export class MangaService {
    
  private baseUrl = 'http://localhost:8080/mangas';

  constructor(private httpClient: HttpClient) { }

  // Método para buscar classificações indicativas
  findClassificacaoIndicativa(): Observable<ClassificacaoIndicativa[]> {
    return this.httpClient.get<ClassificacaoIndicativa[]>(`${this.baseUrl}/classificacaoIndicativa`);
  }

  // Método para buscar todos os mangás com paginação
  findAll(page?: number, size?: number): Observable<Manga[]> {
    let params = {};
    if (page !== undefined && size !== undefined) {
      params = {
        page: page.toString(),
        size: size.toString()
      };
    }
    return this.httpClient.get<Manga[]>(this.baseUrl, { params });
  }

  // Método para contar a quantidade total de mangás
  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  // Método para buscar um mangá por ID
  findById(idManga: number): Observable<Manga> {
    return this.httpClient.get<Manga>(`${this.baseUrl}/${idManga}`).pipe(
      tap(data => console.log('Dados retornados:', data))
    ); 
  }

  // Método para criar um novo mangá
  create(data: any): Observable<Manga> {
    return this.httpClient.post<Manga>(`${this.baseUrl}/insert`, data);
  }

  // Método para atualizar um mangá existente
  update(data: any): Observable<Manga> {
    return this.httpClient.put<Manga>(`${this.baseUrl}/update/${data.idManga}`, data);
  }

  // Método para excluir um mangá por ID
  delete(idManga: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${idManga}`);
  }
}
