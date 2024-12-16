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

  // Método para criar um novo usuário
  public createUsuario(usuario: Usuario, token: string): Observable<any> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.post(`${this.baseUrl}/insert`, usuario, { headers });
  }
  
  // Método para atualizar um usuário
  public updateUsuario(id: number, usuario: Usuario, token: string): Observable<any> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.put(`${this.baseUrl}/update/${id}`, usuario, { headers });
  }

  // Método para buscar todos os usuários com paginação
  public getUsuarios(page: number = 0, size: number = 10): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  // Método para buscar um usuário por ID
  public getUsuarioById(id: number, token: string): Observable<Usuario> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.get<Usuario>(`${this.baseUrl}/${id}`, { headers });
  }  

  // Método para deletar um usuário
  public deleteUsuario(id: number, token: string): Observable<any> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.delete(`${this.baseUrl}/delete/${id}`, { headers });
  }

  // Método para buscar perfis disponíveis
  public getPerfis(): Observable<Perfil[]> {
    return this.httpClient.get<Perfil[]>(`${this.baseUrl}/perfil`);
  }

}