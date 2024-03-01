import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError, EMPTY, from, map, Observable } from 'rxjs';
import { Route } from '../../../../routes';
import { RankingAction } from '../../state/actions/ranking.action';

@Injectable({
    providedIn: 'root'
})
export class ListResolver implements Resolve<boolean> {
    private readonly router = inject(Router);
    private readonly store = inject(Store);

    public resolve(route: ActivatedRouteSnapshot): Observable<boolean | never> {
        const id = route.paramMap.get('id');

        if (!id || isNaN(+id)) {
            this.router.navigate([`/${Route.ranking}`, 1]);
            return EMPTY;
        }

        return this.store.dispatch(new RankingAction.SelectCircle(Number(id))).pipe(
            map(() => true),
            catchError((e) => {
                console.log(e);
                this.router.navigate([`/${Route.circles}`]);
                return EMPTY;
            })
        );
    }
}
