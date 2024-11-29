import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";

import { Usuario } from "../models/usuario.model";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private tokenKey = 'jwt_token';
  private usuarioLogadoKey = 'usuario_logado';
  private usuarioLogadoSubject = new BehaviorSubject<Usuario | null>(null);

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private jwtHelper: JwtHelperService
  ) {
    this.initUsuarioLogado();
  }

  /** Inicializa o usuário logado a partir do localStorage */
  public initUsuarioLogado(): void {
    const usuario = this.localStorageService.getItem(this.usuarioLogadoKey);
    if (usuario) {
      const usuarioLogado = JSON.parse(usuario);
      this.usuarioLogadoSubject.next(usuarioLogado);
    }
  }

  /** Login no sistema */
  public login(username: string, senha: string, administrador: boolean = false): Observable<HttpResponse<any>> {
    const params = { username, senha, administrador };
    return this.httpClient.post<any>(
      this.baseUrl,
      params,
      { observe: 'response' } // Captura o cabeçalho e o corpo da resposta
    ).pipe(
      tap((res: HttpResponse<any>) => {
        const authToken = res.headers.get('authorization'); // Busca o token no cabeçalho
        if (authToken) {
          this.setToken(authToken); // Armazena o token no localStorage
          const usuarioLogado = res.body; // Dados do usuário no corpo da resposta
          if (usuarioLogado) {
            this.setUsuarioLogado(usuarioLogado); // Atualiza o BehaviorSubject
          }
        }
      }),
      catchError((error) => this.handleError(error)) // Trata erros centralizadamente
    );
  }

  /** Realiza o logout do usuário */
  public logout(): void {
    this.removeToken();
    this.removeUsuarioLogado();
    console.log('Usuário desconectado com sucesso');
  }

  /** Verifica se o token JWT está expirado */
  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true; // Sem token, considerado expirado
    }
    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error('Erro ao verificar expiração do token:', error);
      return true; // Em caso de erro, considere expirado
    }
  }

  /** Retorna o usuário logado como Observable */
  public getUsuarioLogado(): Observable<Usuario | null> {
    return this.usuarioLogadoSubject.asObservable();
  }

  /** Define o usuário logado no localStorage */
  private setUsuarioLogado(usuario: Usuario): void {
    this.localStorageService.setItem(this.usuarioLogadoKey, JSON.stringify(usuario));
    this.usuarioLogadoSubject.next(usuario);
  }

  /** Armazena o token JWT */
  private setToken(token: string): void {
    this.localStorageService.setItem(this.tokenKey, `Bearer ${token}`); // Adiciona o prefixo "Bearer"
  }

  /** Retorna o token JWT */
  public getToken(): string | null {
    const token = this.localStorageService.getItem(this.tokenKey);
    return token ? token.replace('Bearer ', '') : null; // Remove o prefixo "Bearer" ao retornar
  }

  /** Remove o token JWT */
  private removeToken(): void {
    this.localStorageService.removeItem(this.tokenKey);
  }

  /** Remove o usuário logado */
  private removeUsuarioLogado(): void {
    this.localStorageService.removeItem(this.usuarioLogadoKey);
    this.usuarioLogadoSubject.next(null);
  }

  /** Centraliza o tratamento de erros */
  private handleError(error: any): Observable<never> {
    console.error('Erro no AuthService:', error);
    alert('Erro ao autenticar. Por favor, tente novamente.');
    return throwError(() => new Error('Erro ao autenticar'));
  }
}
