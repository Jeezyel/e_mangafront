import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { Observable } from 'rxjs';
import { Telefone } from "../../../models/telefone.model";
import { TelefoneService } from "../../../services/telefone.service";

export const telefoneResolver: ResolveFn<Observable<Telefone>> = 
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Telefone> => {
        const idTelefone = route.paramMap.get('idTelefone');
        return inject(TelefoneService).findById(Number(idTelefone));
    }
