import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { Observable } from 'rxjs';
import { Editora } from "../../../models/editora.model";
import { EditoraService } from "../../../services/editora.service";

export const editoraResolver: ResolveFn<Observable<Editora>> = 
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Editora> => {
        const idEditora = route.paramMap.get('idEditora');
        return inject(EditoraService).findById(Number(idEditora));
    }