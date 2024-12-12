import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { Manga } from "../../../models/manga.model";
import { MangaService } from "../../../services/manga.service";

export const mangaResolver: ResolveFn<Observable<Manga>> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Manga> => {
        const idManga = route.paramMap.get('idManga');
        return inject(MangaService).findById(Number(idManga));
    }