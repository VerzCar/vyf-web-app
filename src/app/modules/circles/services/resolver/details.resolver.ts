import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { Route } from '../../../../routes';
import { CirclesAction } from '../../state/actions/circles.action';

@Injectable({
    providedIn: 'root'
})
export class DetailsResolver implements Resolve<boolean> {
    private readonly router = inject(Router);
    private readonly store = inject(Store);

    public resolve(route: ActivatedRouteSnapshot): Observable<boolean | never> {
        const id = route.paramMap.get('id');

        if (!id || isNaN(+id)) {
            this.router.navigate([`/${Route.circles}`]);
            return EMPTY;
        }

        return this.store.dispatch(new CirclesAction.SelectCircle(Number(id))).pipe(
            map(() => true),
            catchError(() => {
                this.router.navigate([`/${Route.circles}`]);
                return EMPTY;
            })
        );
    }
}
