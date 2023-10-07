import { inject, Injectable } from '@angular/core';
import {
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { CirclesAction } from '../circles-state/actions/circles.action';

@Injectable({
    providedIn: 'root'
})
export class DetailsResolver implements Resolve<boolean> {
    private readonly store = inject(Store);

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const id = route.paramMap.get('id');
        return this.store.dispatch(new CirclesAction.SelectCircle(Number(id))).pipe(
            map(() => true)
        );
    }
}
