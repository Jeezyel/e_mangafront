import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { Observable } from 'rxjs';
import { Genero } from "../../../models/genero.model";
import { GeneroService } from "../../../services/genero.service";

export const generoResolver: ResolveFn<Observable<Genero>> = 
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Genero> => {
        const idMangaGenero = route.paramMap.get('idMangaGenero');
        return inject(GeneroService).findById(Number(idMangaGenero));
    }
