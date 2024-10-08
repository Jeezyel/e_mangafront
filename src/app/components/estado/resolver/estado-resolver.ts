import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Estado } from "../../../models/estado.model";
import { EstadoService } from "../../../services/estado.service";
import { inject } from "@angular/core";
import { Observable } from 'rxjs';

export const estadoResolver: ResolveFn<Observable<Estado>> = 
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Estado> => {
        const id = route.paramMap.get('id');
        return inject(EstadoService).findById(Number(id));
    }
