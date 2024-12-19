import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Municipio } from '../models/municipio.model';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  private baseUrl = 'http://localhost:8080/municipios';

  constructor(private httpClient: HttpClient) {
  }

  findAll(page: number, size: number): Observable<Municipio[]> {
    let params = {};
            if (page !== undefined && size !== undefined) {
              params = {
                page: page.toString(),
                size: size.toString()
              };
            }
        
            console.log(params);
            return this.httpClient.get<Municipio[]>(this.baseUrl, { params });
  }

  findById(id: number): Observable<Municipio> {
    return this.httpClient.get<Municipio>(`${this.baseUrl}/${id}`); 
  }

  create(municipio: { nome: string; idEstado: number }): Observable<Municipio> {
    return this.httpClient.post<Municipio>(`${this.baseUrl}/insert`, municipio);
  }

  update(municipio: Municipio): Observable<Municipio> {

    const data = {
      nome: municipio.nome,
      idEstado: municipio.nomeEstado.id
    }

    return this.httpClient.put<Municipio>(`${this.baseUrl}/update/${municipio.idMunicipio}`, data); 
  }

  delete(id: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${id}`); 
  }

  // Método para contar o total de registros (usado para a paginação)
  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

}