import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
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
    private usuarioLogadoSubject = new BehaviorSubject<Usuario|null>(null);

    constructor(private httpClient: HttpClient,
                private localStorageService: LocalStorageService,
                private jwtHelper: JwtHelperService
    ) {
        this.initUsuarioLogado();
    }

    private initUsuarioLogado():void {
        const usuario = this.localStorageService.getItem(this.usuarioLogadoKey);
        if (usuario) {
            // const usuarioLogado = JSON.parse(usuario);
            this.usuarioLogadoSubject.next(usuario);
        }
    }

    public login(username: string, senha: string, administrador: boolean): Observable<any> {
        const params = {
            login: username,
            senha: senha,
            administrador // ADM
        };
        return this.httpClient.post(`${this.baseUrl}`, params, {observe: 'response'}).pipe(
            tap((res: any) => {
                const authToken = res.headers.get('Authorization') ?? '';
                if (authToken) {
                    this.setToken(authToken);
                    const usuarioLogado = res.body;
                    if (usuarioLogado) {
                        this.setUsuarioLogado(usuarioLogado);
                        this.usuarioLogadoSubject.next(usuarioLogado);
                    }
                }
            })
        );
    }
  
    setUsuarioLogado(usuario: Usuario): void {
      this.localStorageService.setItem(this.usuarioLogadoKey, JSON.stringify(usuario));
      this.usuarioLogadoSubject.next(usuario);
    }

    setToken(token: string): void {
        this.localStorageService.setItem(this.tokenKey, token);
    }

    getUsuarioLogado() {
        return this.usuarioLogadoSubject.asObservable();
    }

    getToken(): string | null {
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
        const token = this.getToken();
        if (!token) {
            return true;
        }
        try {
            return this.jwtHelper.isTokenExpired(token);
        } catch (error) {
            console.error('Token invalido', error);
            return true;
        }
    }

}