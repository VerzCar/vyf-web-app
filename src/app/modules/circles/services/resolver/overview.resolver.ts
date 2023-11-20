import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { CirclesAction } from '../../state/actions/circles.action';

@Injectable({
    providedIn: 'root'
})
export class OverviewResolver implements Resolve<boolean> {
    private readonly router = inject(Router);
    private readonly store = inject(Store);

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | never> {
        return this.store.dispatch(new CirclesAction.InitUserCircles()).pipe(
            map(() => true),
            catchError(() => {
                this.router.navigate(['']);
                return EMPTY;
            })
        );
    }
}
