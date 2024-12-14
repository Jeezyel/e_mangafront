import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genero } from '../models/genero.model';


@Injectable({
  providedIn: 'root'
})
export class GeneroService {
  private baseUrl = 'http://localhost:8080/generos';

  constructor(private httpClient: HttpClient) {}

  //A paginação fica aqui
  findAll(page: number, size: number): Observable<Genero[]> {
    let params = {};
            if (page !== undefined && size !== undefined) {
              params = {
                page: page.toString(),
                size: size.toString()
              };
            }
        
            console.log(params);
            return this.httpClient.get<Genero[]>(this.baseUrl, { params });
  }

  findById(idMangaGenero: number): Observable<Genero> {
    return this.httpClient.get<Genero>(`${this.baseUrl}/${idMangaGenero}`); 
  }

  create(genero: Genero): Observable<Genero> {
    return this.httpClient.post<Genero>(`${this.baseUrl}/insert`, genero);
  }

  update(genero: Genero): Observable<Genero> {
    return this.httpClient.put<Genero>(`${this.baseUrl}/update/${genero.idMangaGenero}`, genero); 
  }

  delete(idMangaGenero: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${idMangaGenero}`); 
  }

  // Método para contar o total de registros (usado para a paginação)
  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

}
