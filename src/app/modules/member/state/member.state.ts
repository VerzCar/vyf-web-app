import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { Circle, VoteCircleService, VoteCreateRequest } from '@vyf/vote-circle-service';
import { map, Observable, of, tap } from 'rxjs';
import { MemberStateModel } from '../models';
import { MemberAction } from './actions/member.action';

const DEFAULT_STATE: MemberStateModel = {
    selectedCircle: undefined
};

@State<MemberStateModel>({
    name: 'member',
    defaults: DEFAULT_STATE
})
@Injectable()
export class MemberState {
    private readonly voteCircleService = inject(VoteCircleService);

    @Action(MemberAction.SelectCircle)
    private selectCircle(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.SelectCircle
    ): Observable<Circle> {
        const { selectedCircle } = ctx.getState();

        if (selectedCircle && selectedCircle.id === action.circleId) {
            return of(selectedCircle);
        }

        return ctx.dispatch([
            new MemberAction.FetchCircle(action.circleId)
        ]).pipe(
            map(() => ctx.getState().selectedCircle as Circle)
        );
    }

    @Action(MemberAction.FetchCircle)
    private fetchCircle(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.FetchCircle
    ): Observable<Circle> {
        return this.voteCircleService.circle(action.circleId).pipe(
            map(res => res.data),
            tap((circle) => ctx.patchState({ selectedCircle: circle }))
        );
    }

    @Action(MemberAction.Vote)
    private vote(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Vote
    ): Observable<boolean> {
        const { selectedCircle } = ctx.getState();

        if (!isDefined(selectedCircle)) {
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
