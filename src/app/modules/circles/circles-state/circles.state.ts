import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { Circle, VoteCircleService } from '@vyf/vote-circle-service';
import { map, Observable, of, tap } from 'rxjs';
import { CirclesStateModel } from '../models/circles-state.model';
import { CirclesAction } from './actions/circles.action';

const DEFAULT_STATE: CirclesStateModel = {
  selectedCircle: undefined
};

@State<CirclesStateModel>({
  name: 'circles',
  defaults: DEFAULT_STATE
})
@Injectable()
export class CirclesState {
  private readonly voteCircleService = inject(VoteCircleService);

  @Action(CirclesAction.SelectCircle)
  private selectCircle(
	ctx: StateContext<CirclesStateModel>,
	action: CirclesAction.SelectCircle
  ): Observable<Circle> {
	const { selectedCircle } = ctx.getState();

	if (selectedCircle && selectedCircle.id === action.circleId) {
	  return of(selectedCircle);
	}

	return ctx.dispatch(new CirclesAction.FetchCircle(action.circleId)).pipe(
	  map(() => ctx.getState().selectedCircle as Circle)
	);
  }

  @Action(CirclesAction.FetchCircle)
  private fetchCircle(
	ctx: StateContext<CirclesStateModel>,
	action: CirclesAction.FetchCircle
  ): Observable<Circle> {
	return this.voteCircleService.circle(action.circleId).pipe(
	  map(res => res.data),
	  tap((circle) => ctx.patchState({ selectedCircle: circle }))
	);
  }
}
