import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endereco } from '../models/endereco.model';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {

  private baseUrl = 'http://localhost:8080/enderecos';

  constructor(private httpClient: HttpClient) {
  }

  findAll(page: number, size: number): Observable<Endereco[]> {
    return this.httpClient.get<Endereco[]>(`${this.baseUrl}?page=${page}&size=${size}`); 
  }

  findById(id: number): Observable<Endereco> {
    return this.httpClient.get<Endereco>(`${this.baseUrl}/${id}`); 
  }

  create(endereco: { 
    cep: string; 
    logradouro: string; 
    complemento: string; 
    bairro: string; 
    idMunicipio: number;}): Observable<Endereco> {
    return this.httpClient.post<Endereco>(`${this.baseUrl}/insert`, endereco);
  }

  update(endereco: Endereco): Observable<Endereco> {

    const data = {
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        idMunicipio: endereco.municipio.idMunicipio
    }

    return this.httpClient.put<Endereco>(`${this.baseUrl}/update/${endereco.idEndereco}`, data); 
  }

  delete(idEndereco: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${idEndereco}`); 
  }

  // Método para contar o total de registros (usado para a paginação)
  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

}