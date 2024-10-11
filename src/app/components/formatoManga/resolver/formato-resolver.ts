import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { Observable } from 'rxjs';
import { Formato } from "../../../models/formato";
import { FormatoService } from "../../../services/formato.service";

export const formatoResolver: ResolveFn<Observable<Formato>> = 
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Formato> => {
        const idFormato = route.paramMap.get('idFormato');
        return inject(FormatoService).findById(Number(idFormato));
    }