import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { Usuario } from "../../../models/usuario.model";
import { UsuarioService } from "../../../services/usuario.service";

export const usuarioResolver: ResolveFn<Observable<Usuario>> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Usuario> => {
        const id = route.paramMap.get('id');
        return inject(UsuarioService).findById(Number(id));
    }