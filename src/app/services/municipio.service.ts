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

  findAll(): Observable<Municipio[]> {
    return this.httpClient.get<Municipio[]>(this.baseUrl); 
  }

  findById(idMunicipio: number): Observable<Municipio> {
    return this.httpClient.get<Municipio>(`${this.baseUrl}/${idMunicipio}`); 
  }

  create(municipio: Municipio): Observable<Municipio> {
    const data = {
      nome: municipio.nome,
      idEstado: municipio.estado.id
    }
    return this.httpClient.post<Municipio>(this.baseUrl, data);
  }

  update(municipio: Municipio): Observable<Municipio> {
    const data = {
      nome: municipio.nome,
      idEstado: municipio.estado.id
    }
    return this.httpClient.put<any>(`${this.baseUrl}/${municipio.idMunicipio}`, data); 
  }

  delete(idMunicipio: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${idMunicipio}`); 
  }

}