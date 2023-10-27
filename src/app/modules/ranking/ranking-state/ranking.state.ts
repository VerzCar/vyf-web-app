import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { Circle, VoteCircleService, VoteCreateRequest } from '@vyf/vote-circle-service';
import { map, Observable, of, tap } from 'rxjs';
import { RankingStateModel } from '../models';
import { RankingAction } from './actions/ranking.action';

const DEFAULT_STATE: RankingStateModel = {
    selectedCircle: undefined
};

@State<RankingStateModel>({
    name: 'ranking',
    defaults: DEFAULT_STATE
})
@Injectable()
export class RankingState {
    private readonly voteCircleService = inject(VoteCircleService);

    @Action(RankingAction.SelectCircle)
    private selectCircle(
        ctx: StateContext<RankingStateModel>,
        action: RankingAction.SelectCircle
    ): Observable<Circle> {
        const { selectedCircle } = ctx.getState();

        if (selectedCircle && selectedCircle.id === action.circleId) {
            return of(selectedCircle);
        }

        return ctx.dispatch(new RankingAction.FetchCircle(action.circleId)).pipe(
            map(() => ctx.getState().selectedCircle as Circle)
        );
    }

    @Action(RankingAction.FetchCircle)
    private fetchCircle(
        ctx: StateContext<RankingStateModel>,
        action: RankingAction.FetchCircle
    ): Observable<Circle> {
        return this.voteCircleService.circle(action.circleId).pipe(
            map(res => res.data),
            tap((circle) => ctx.patchState({ selectedCircle: circle }))
        );
    }

    @Action(RankingAction.Vote)
    private vote(
        ctx: StateContext<RankingStateModel>,
        action: RankingAction.Vote
    ): Observable<boolean> {
        const { selectedCircle } = ctx.getState();

        if(!isDefined(selectedCircle)) {
            throw new Error('selected Circle is not defined');
        }

        const voteCreateRequest: VoteCreateRequest = {
            circleId: action.circleId,
            elected: action.electedIdentId
        };

        return this.voteCircleService.createVote(voteCreateRequest).pipe(
            map(res => res.data),
            tap(success => {
                const voters = selectedCircle.voters;
                const foundElectedVoter = voters.find(voter => voter.voter === action.electedIdentId);

            })
        );
    }

}
