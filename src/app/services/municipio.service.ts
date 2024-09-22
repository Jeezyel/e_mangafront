import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Municipio } from '../models/municipio.model';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {
  private baseUrl = 'http://localhost:8080/municipios';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Municipio[]> {
    
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Municipio[]>(`${this.baseUrl}/getall`, {params});
  }

  findByName(name: string): Observable<Municipio> {
    return this.httpClient.get<Municipio>(`${this.baseUrl}/search/${name}`);
  }

  insert(municipio: Municipio): Observable<Municipio> {
    const data = {
      nome: municipio.nome,
      idEstado: municipio.estado.id
    }
    return this.httpClient.post<Municipio>(`${this.baseUrl}/insert`, data);
  }
  
  update(municipio: Municipio): Observable<Municipio> {
    const data = {
      nome: municipio.nome,
      idEstado: municipio.estado.id
    }
    return this.httpClient.put<Municipio>(`${this.baseUrl}/update/${municipio.id}`, data);
  }

  delete(municipio: Municipio): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${municipio.id}`);
  }

}