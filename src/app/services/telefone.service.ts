import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Telefone } from '../models/telefone.model';

@Injectable({
  providedIn: 'root'
})
export class TelefoneService {
  private baseUrl = 'http://localhost:8080/telefones';

  constructor(private httpClient: HttpClient) {}

  //A paginação fica aqui
  findAll(page: number, size: number): Observable<Telefone[]> {
    return this.httpClient.get<Telefone[]>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  findById(idTelefone: number): Observable<Telefone> {
    return this.httpClient.get<Telefone>(`${this.baseUrl}/${idTelefone}`); 
  }

  create(telefone: Telefone): Observable<Telefone> {
    return this.httpClient.post<Telefone>(`${this.baseUrl}/insert`, telefone);
  }

  update(telefone: Telefone): Observable<Telefone> {
    return this.httpClient.put<Telefone>(`${this.baseUrl}/update/${telefone.idTelefone}`, telefone); 
  }

  delete(idTelefone: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${idTelefone}`); 
  }

  // Método para contar o total de registros (usado para a paginação)
  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

}
