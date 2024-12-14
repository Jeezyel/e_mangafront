import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formato } from '../models/formato.model';

@Injectable({
  providedIn: 'root'
})
export class FormatoService {
  private baseUrl = 'http://localhost:8080/formatos';

  constructor(private httpClient: HttpClient) {}

  //A paginação fica aqui
  findAll(page: number, size: number): Observable<Formato[]> {
    let params = {};
            if (page !== undefined && size !== undefined) {
              params = {
                page: page.toString(),
                size: size.toString()
              };
            }
        
            console.log(params);
            return this.httpClient.get<Formato[]>(this.baseUrl, { params });
  }

  findById(idFormato: number): Observable<Formato> {
    return this.httpClient.get<Formato>(`${this.baseUrl}/${idFormato}`); 
  }

  create(formato: Formato): Observable<Formato> {
    return this.httpClient.post<Formato>(`${this.baseUrl}/insert`, formato);
  }

  update(formato: Formato): Observable<Formato> {
    return this.httpClient.put<Formato>(`${this.baseUrl}/update/${formato.idFormato}`, formato); 
  }

  delete(idFormato: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${idFormato}`); 
  }

  // Método para contar o total de registros (usado para a paginação)
  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

}