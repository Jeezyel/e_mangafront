import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ClassificacaoIndicativa } from '../models/classificacaoindicativa.model';
import { Manga } from '../models/manga.model';

@Injectable({
  providedIn: 'root'
})
export class MangaService {

  private baseUrl = 'http://localhost:8080/mangas';

  constructor(private httpClient: HttpClient) {}

  getUrlImage(nomeImagem: string): string {
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }

  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', id.toString());
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem, imagem.name);

    return this.httpClient.patch<Manga>(`${this.baseUrl}/image/upload`, formData);
  }

  findClassificacaoIndicativa(): Observable<ClassificacaoIndicativa[]> {
    return this.httpClient.get<ClassificacaoIndicativa[]>(`${this.baseUrl}/classificacaoindicativa`);
  }  

  findAll(page?: number, pageSize?: number): Observable<Manga[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }

    return this.httpClient.get<Manga[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(idManga: number): Observable<Manga> {
    return this.httpClient.get<Manga>(`${this.baseUrl}/${idManga}`);
  }

  insert(manga: Manga): Observable<Manga> {
    const data = {
      nome: manga.nome,
      idEditora: manga.editora.idEditora,
      idFormato: manga.formato.idFormato,
      idIdioma: manga.idioma.idIdioma,
      idClassificacaoIndicativa: manga.classificacaoindicativa.id, // Enum value directly
      nomeImagem: manga.nomeImagem,
      estoque: manga.estoque,
      preco: manga.preco
    };

    return this.httpClient.post<Manga>(this.baseUrl, data);
  }

  update(manga: Manga): Observable<Manga> {
    const data = {
      nome: manga.nome,
      idEditora: manga.editora.idEditora,
      idFormato: manga.formato.idFormato,
      idIdioma: manga.idioma.idIdioma,
      idClassificacaoIndicativa: manga.classificacaoindicativa.id, // Enum value directly
      nomeImagem: manga.nomeImagem,
      estoque: manga.estoque,
      preco: manga.preco
    };

    return this.httpClient.put<Manga>(`${this.baseUrl}/${manga.idManga}`, data);
  }

  delete(idManga: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${idManga}`);
  }
  
}