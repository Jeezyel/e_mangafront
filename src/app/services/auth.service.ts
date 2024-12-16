import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Usuario } from "../models/usuario.model";
import { LocalStorageService } from "./local-storage.service";
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable({
    providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/auth';
  private tokenKey = 'jwt_token';
  private usuarioLogadoKey = 'usuario_logado';
  private usuarioLogadoSubject = new BehaviorSubject<Usuario|null>(null);

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private jwtHelper: JwtHelperService
  
  ) { this.initUsuarioLogado(); }

  private initUsuarioLogado():void {
    const usuario = this.localStorageService.getItem(this.usuarioLogadoKey);
    if (usuario) {
      const parsedUsuario = JSON.parse(usuario);
      this.usuarioLogadoSubject.next(parsedUsuario);
    }
  }

  public login(username: string, senha: string, perfil: string): Observable<any> {
    const params = { username: username, senha: senha, perfil: perfil };

    return this.httpClient.post(`${this.baseUrl}`, params, { observe: 'response' }).pipe(
      tap((res: any) => {
        console.log('Resposta completa do backend:', res); // Log da resposta
        const authToken = res.headers.get('Authorization') ?? '';
        console.log('Token recebido:', authToken); // Loga o token recebido        
        if (authToken) {
          this.setToken(authToken);
          const usuarioLogado = res.body;
          console.log('Usuário logado:', usuarioLogado);
        if (usuarioLogado) {
          this.setUsuarioLogado(usuarioLogado);
          this.usuarioLogadoSubject.next(usuarioLogado);
        }
      }
    })
    );
  }

  /** Realiza o logout do usuário */
  public logout(): void {
    this.removeToken();
    this.removeUsuarioLogado();
    console.log('Usuário desconectado com sucesso');
  }
  
  setUsuarioLogado(usuario: Usuario): void {
    this.localStorageService.setItem(this.usuarioLogadoKey, JSON.stringify (usuario));
  }

  setToken(token: string): void {
    this.localStorageService.setItem(this.tokenKey, token);
  }

  getUsuarioLogado(): Usuario | null {
    const usuario = this.localStorageService.getItem(this.usuarioLogadoKey);
    if (usuario) {
      const parsedUsuario = JSON.parse(usuario);
  
      // Adaptar o perfil retornado para o modelo esperado
      if (typeof parsedUsuario.perfil === 'string') {
        parsedUsuario.perfil = {
          id: parsedUsuario.perfil === 'ADMIN' ? 1 : 2,
          label: parsedUsuario.perfil
        };
      }
  
      return parsedUsuario;
    }
    return null;
  }

  getUsuarioLogadoValue(): Usuario | null {
    return this.usuarioLogadoSubject.value;
  }

  public getToken(): string | null {
    return this.localStorageService.getItem(this.tokenKey);
  }

  removeToken(): void {
      this.localStorageService.removeItem(this.tokenKey);
  }

  removeUsuarioLogado() :void {
      this.localStorageService.removeItem(this.usuarioLogadoKey);
      this.usuarioLogadoSubject.next(null);
  }

  isTokenExpired(): boolean {
    const token = this.getToken(); // Recupera o token salvo
  
    // Debug: Exibe o token armazenado no console
    console.log('Token armazenado:', token);
  
    if (token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token); // Decodifica o token
        console.log('Token decodificado:', decodedToken); // Exibe o token decodificado
        return this.jwtHelper.isTokenExpired(token); // Verifica se está expirado
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return true; // Em caso de erro, considera expirado
      }
    }
  
    console.warn('Nenhum token encontrado.');
    return true; // Se o token não existir, considera expirado
  }
  

  // Novo método: Verifica se o usuário logado é admin
  isAdmin(): boolean {
    const usuario = this.usuarioLogadoSubject.value;
    return usuario ? usuario.perfil.id === 1 : false;
  }

  // Novo método: Obtém o ID do usuário logado
  getLoggedUserId(): number | null {
    const usuario = this.usuarioLogadoSubject.value;
    return usuario ? usuario.id : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired();
  }
  
}