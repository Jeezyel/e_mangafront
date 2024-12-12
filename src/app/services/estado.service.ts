import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estado } from '../models/estado.model';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private baseUrl = 'http://localhost:8080/estados';

  constructor(private httpClient: HttpClient) {}

  //A paginação fica aqui
  findAll(page: number, size: number): Observable<Estado[]> {
    return this.httpClient.get<Estado[]>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  findById(id: number): Observable<Estado> {
    return this.httpClient.get<Estado>(`${this.baseUrl}/${id}`); 
  }

  create(estado: Estado): Observable<Estado> {
    return this.httpClient.post<Estado>(`${this.baseUrl}/insert`, estado);
  }

  update(estado: Estado): Observable<Estado> {
    return this.httpClient.put<Estado>(`${this.baseUrl}/update/${estado.id}`, estado); 
  }

  delete(id: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${id}`); 
  }

  // Método para contar o total de registros (usado para a paginação)
  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

}
