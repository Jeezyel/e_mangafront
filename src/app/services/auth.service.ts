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
    const usuarioJson = this.localStorageService.getItem(this.usuarioLogadoKey);
    if (usuarioJson) {
      try {
        const usuarioLogado = JSON.parse(usuarioJson);
        this.usuarioLogadoSubject.next(usuarioLogado);
      } catch (error) {
        console.error('Erro ao desserializar usuário logado:', error);
        this.usuarioLogadoSubject.next(null);
      }
    }
  }

  public loginADM(username: string, senha: string): Observable<any> {
    const params = {
        login: username,
        senha: senha,
        perfil: 1 // ADM
    }

    return this.httpClient.post(`${this.baseUrl}`, params, { observe: 'response' }).pipe(
      tap((res: any) => {
        console.log('Resposta completa do backend:', res); // Log da resposta
        const authToken = res.headers.get('Authorization');
        console.log('Token recebido:', authToken); // Loga o token recebido
        
        if (authToken) {
          this.setToken(authToken);
          console.log('Token armazenado com sucesso:', authToken);
        } else {
          console.error('Token ausente na resposta do backend.');
        }
      })
    );
  }

  public loginUSER(username: string, senha: string): Observable<any> {
    const params = {
      login: username,
      senha: senha,
      perfil: 2 // USER
    };
      
    return this.httpClient.post(`${this.baseUrl}`, params, { observe: 'response' }).pipe(
      tap((res: any) => {
        console.log('Resposta completa do backend:', res); // Log da resposta
        const authToken = res.headers.get('Authorization');
        console.log('Token recebido:', authToken); // Loga o token recebido
        
        if (authToken) {
          this.setToken(authToken);
          console.log('Token armazenado com sucesso:', authToken);
        } else {
          console.error('Token ausente na resposta do backend.');
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

  getUsuarioLogado() {
    return this.usuarioLogadoSubject.asObservable();
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