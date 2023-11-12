import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { MemberAction } from '../../state/actions/member.action';

@Injectable({
    providedIn: 'root'
})
export class ListResolver implements Resolve<boolean> {
    private readonly store = inject(Store);
    private readonly router = inject(Router);

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const id = route.paramMap.get('id');
        return this.store.dispatch(new MemberAction.SelectCircle(Number(id))).pipe(
            map(() => true),
            catchError((e) => {
                this.router.navigate(['/circles']);
                return EMPTY;
            })
        );
    }
}
