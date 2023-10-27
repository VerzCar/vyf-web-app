import { inject, Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { RankingAction } from '../../ranking-state/actions/ranking.action';

@Injectable({
    providedIn: 'root'
})
export class ListResolver implements Resolve<boolean> {
    private readonly router = inject(Router);
    private readonly store = inject(Store);

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | never> {
        const id = route.paramMap.get('id');
        return this.store.dispatch(new RankingAction.SelectCircle(Number(id))).pipe(
            map(() => true),
            catchError(() => {
                this.router.navigate(['/circles']);
                return EMPTY;
            })
        );
    }
}
