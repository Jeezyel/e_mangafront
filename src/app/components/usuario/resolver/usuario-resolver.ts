import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { Usuario } from "../../../models/usuario.model";
import { UsuarioService } from "../../../services/usuario.service";
import { AuthService } from "../../../services/auth.service";

export const usuarioResolver: ResolveFn<Observable<Usuario>> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Usuario> => {
        const id = route.paramMap.get('id');
        if (!id) {
            throw new Error('ID do usuário não encontrado na rota.');
        }

        const authService = inject(AuthService);
        const token = authService.getToken();

        if (!token) {
            throw new Error('Token de autenticação ausente.');
        }
        return inject(UsuarioService).getUsuarioById(Number(id), token);
         
    }