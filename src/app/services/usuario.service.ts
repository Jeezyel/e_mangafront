import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Perfil } from '../models/perfil.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    
  private baseUrl = 'http://localhost:8080/usuario';

  constructor(private httpClient: HttpClient) { }

  // Método para buscar perfil
  findPerfil(): Observable<Perfil[]> {
    return this.httpClient.get<Perfil[]>(`${this.baseUrl}/perfil`);
  }

  // Método para buscar um mangá por ID
  findById(id: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.baseUrl}/${id}`).pipe(
      tap(data => console.log('Dados retornados:', data))
    ); 
  }

  // Método para criar um novo usuario
  create(data: any): Observable<Usuario> {
    return this.httpClient.post<Usuario>(`${this.baseUrl}/insert`, data);
  }

  // Método para atualizar um usuario existente
  update(data: any): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.baseUrl}/update/${data.id}`, data);
  }

  // Método para excluir um usuario por ID
  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${id}`);
  }

  buscarUsuarioLogado(): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.baseUrl}/me`);
  }

}