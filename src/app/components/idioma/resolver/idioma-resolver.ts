import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { Observable } from 'rxjs';
import { Idioma } from "../../../models/idioma.model";
import { IdiomaService } from "../../../services/idioma.service";

export const idiomaResolver: ResolveFn<Observable<Idioma>> = 
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Idioma> => {
        const idIdioma = route.paramMap.get('idIdioma');
        return inject(IdiomaService).findById(Number(idIdioma));
    }