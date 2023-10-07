import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { CirclesAction } from '../circles-state/actions/circles.action';
import { CirclesSelectors } from '../circles-state/circles.selectors';

@Injectable({
  providedIn: 'root'
})
export class CircleEditGuard implements CanActivate {

  private readonly store = inject(Store);

  public canActivate(
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
	const id = route.paramMap.get('id');
	return this.store.dispatch(new CirclesAction.SelectCircle(Number(id))).pipe(
	  map(() => this.store.selectSnapshot(CirclesSelectors.canEditCircle()))
	);
  }
}
