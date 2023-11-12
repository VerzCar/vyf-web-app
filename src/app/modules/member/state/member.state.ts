import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { UserService } from '@vyf/user-service';
import { Circle, CircleVotersFilter, Commitment, VoteCircleService, Voter } from '@vyf/vote-circle-service';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { Member, MemberStateModel } from '../models';
import { MemberAction } from './actions/member.action';

const DEFAULT_STATE: MemberStateModel = {
    selectedCircle: undefined,
    members: undefined,
    userMember: undefined
};

@State<MemberStateModel>({
    name: 'member',
    defaults: DEFAULT_STATE
})
@Injectable()
export class MemberState {
    private readonly voteCircleService = inject(VoteCircleService);
    private readonly userService = inject(UserService);

    @Action(MemberAction.SelectCircle)
    private selectCircle(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.SelectCircle
    ): Observable<Circle> {
        const { selectedCircle } = ctx.getState();

        if (selectedCircle && selectedCircle.id === action.circleId) {
            return of(selectedCircle);
        }

        const votersFilter: Partial<CircleVotersFilter> = {
            commitment: Commitment.Committed
        };

        return ctx.dispatch([
            new MemberAction.FetchCircle(action.circleId),
            new MemberAction.FetchCircleVoter(action.circleId, votersFilter)
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

    @Action(MemberAction.FetchCircleVoter)
    private fetchCircleVoter(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.FetchCircleVoter
    ): Observable<Member> {
        return this.voteCircleService.circleVoters(action.circleId, action.filter).pipe(
            map(res => res.data),
            switchMap((circleVoter) =>
                forkJoin(this.mapMembers$(circleVoter.voters)).pipe(
                    tap(members => ctx.patchState({ members })),
                    switchMap(() => this.mapMember$(circleVoter.userVoter)),
                    tap(member => ctx.patchState({ userMember: member }))
                )
            )
        );
    }

    private mapMembers$(voters: Voter[]): Observable<Member>[] {
        return voters.map(voter => this.mapMember$(voter));
    }

    private mapMember$(voter: Voter): Observable<Member> {
        return this.userService.x(voter.voter).pipe(
            map(res => ({
                user: res.data,
                voter
            }))
        );
    }
}
