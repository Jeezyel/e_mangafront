import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Idioma } from '../models/idioma.model'; 

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {
  private baseUrl = 'http://localhost:8080/idiomas';

  constructor(private httpClient: HttpClient) {}

  //A paginação fica aqui
  findAll(page: number, size: number): Observable<Idioma[]> {
    return this.httpClient.get<Idioma[]>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  findById(idIdioma: number): Observable<Idioma> {
    return this.httpClient.get<Idioma>(`${this.baseUrl}/${idIdioma}`); 
  }

  create(idioma: Idioma): Observable<Idioma> {
    return this.httpClient.post<Idioma>(`${this.baseUrl}/insert`, idioma);
  }

  update(idioma: Idioma): Observable<Idioma> {
    return this.httpClient.put<Idioma>(`${this.baseUrl}/update/${idioma.idIdioma}`, idioma); 
  }

  delete(idIdioma: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${idIdioma}`); 
  }

  // Método para contar o total de registros (usado para a paginação)
  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

}
