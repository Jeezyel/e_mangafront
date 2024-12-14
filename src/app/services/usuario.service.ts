import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Perfil } from '../models/perfil.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    
  private baseUrl = 'http://localhost:8080/usuarios';

  constructor(private httpClient: HttpClient) { }

  // Método para buscar classificações indicativas
  findPerfil(): Observable<Perfil[]> {
    return this.httpClient.get<Perfil[]>(`${this.baseUrl}/perfil`);
  }

  // Método para buscar todos os mangás com paginação
  findAll(page?: number, size?: number): Observable<Usuario[]> {
    let params = {};
    if (page !== undefined && size !== undefined) {
      params = {
        page: page.toString(),
        size: size.toString()
      };
    }
    return this.httpClient.get<Usuario[]>(this.baseUrl, { params });
  }

  // Método para contar a quantidade total de mangás
  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  // Método para buscar um mangá por ID
  findById(id: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.baseUrl}/${id}`).pipe(
      tap(data => console.log('Dados retornados:', data))
    ); 
  }

  // Método para criar um novo mangá
  create(data: any): Observable<Usuario> {
    return this.httpClient.post<Usuario>(`${this.baseUrl}/insert`, data);
  }

  // Método para atualizar um mangá existente
  update(data: any): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.baseUrl}/update/${data.id}`, data);
  }

  // Método para excluir um mangá por ID
  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${id}`);
  }

}