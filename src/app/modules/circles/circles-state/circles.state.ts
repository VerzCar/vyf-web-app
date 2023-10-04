import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { VoteCircleService } from '@vyf/vote-circle-service';
import { map, tap } from 'rxjs';
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

    @Action(CirclesAction.FetchCircle)
    private fetchCircle(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.FetchCircle
    ) {
        return this.voteCircleService.circle(action.circleId).pipe(
            map(res => res.data),
            tap((circle) => ctx.patchState({ selectedCircle: circle }))
        );
    }
}
