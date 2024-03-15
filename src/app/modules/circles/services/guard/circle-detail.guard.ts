import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { VoteCircleService } from '@vyf/vote-circle-service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CircleDetailGuard implements CanActivate {
    private readonly voteCircleService = inject(VoteCircleService);
    private readonly router = inject(Router);

    public canActivate(
        route: ActivatedRouteSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const id = route.paramMap.get('id');
        return this.voteCircleService.eligibleToBeInCircle(Number(id)).pipe(
            map(() => true),
            catchError(() => of(this.router.parseUrl('/circles/not-eligible')))
        );
    }

}
