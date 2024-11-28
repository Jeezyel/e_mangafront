import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { Municipio } from "../../../models/municipio.model";
import { MunicipioService } from "../../../services/municipio.service";

export const municipioResolver: ResolveFn<Observable<Municipio>> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Municipio> => {
        const idMunicipio = route.paramMap.get('idMunicipio');
        return inject(MunicipioService).findById(Number(idMunicipio));
    }