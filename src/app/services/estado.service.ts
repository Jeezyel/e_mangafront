import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estado } from '../models/estado.model';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private baseUrl = 'http://localhost:8080/estados';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Estado[]> {
    
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Estado[]>(`${this.baseUrl}/getall`, {params});
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findByName(name: string): Observable<Estado> {
    return this.httpClient.get<Estado>(`${this.baseUrl}/search/${name}`);
  }

  insert(estado: Estado): Observable<Estado> {
    const data = {
      nome: estado.nome,
      sigla: estado.sigla
    }
    return this.httpClient.post<Estado>(`${this.baseUrl}/insert`, data);
  }
  
  update(estado: Estado): Observable<Estado> {
    const data = {
      nome: estado.nome, 
      sigla: estado.sigla
    }
    return this.httpClient.put<any>(`${this.baseUrl}/update/${estado.id}`, data);
  }

  delete(estado: Estado): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${estado.id}`);
  }

}
