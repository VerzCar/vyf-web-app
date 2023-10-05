import { inject, Injectable } from '@angular/core';
import {
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable, of } from 'rxjs';
import { CirclesAction } from '../circles-state/actions/circles.action';
import { CirclesSelectors } from '../circles-state/circles.selectors';

@Injectable({
    providedIn: 'root'
})
export class DetailsResolver implements Resolve<boolean> {
    private readonly store = inject(Store);

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const id = route.paramMap.get('id');

        const selectedCircle = this.store.selectSnapshot(CirclesSelectors.slices.selectedCircle);

        if (selectedCircle?.id === Number(id)) {
            return of(true);
        }

        return this.store.dispatch(new CirclesAction.FetchCircle(Number(id))).pipe(
            map(() => true)
        );
    }
}
