import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { CirclesAction } from '../../state/actions/circles.action';

@Injectable({
  providedIn: 'root'
})
export class DetailsResolver implements Resolve<boolean> {
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | never> {
	const id = route.paramMap.get('id');
	return this.store.dispatch(new CirclesAction.SelectCircle(Number(id))).pipe(
	  map(() => true),
	  catchError(() => {
		this.router.navigate(['/circles']);
		return EMPTY;
	  })
	);
  }
}
