import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { UserService } from '@vyf/user-service';
import { Circle, VoteCircleService } from '@vyf/vote-circle-service';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { Member, MemberStateModel } from '../models';
import { MemberAction } from './actions/member.action';

const DEFAULT_STATE: MemberStateModel = {
    selectedCircle: undefined,
    members: undefined
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

        return ctx.dispatch([
            new MemberAction.FetchCircle(action.circleId)
        ]).pipe(
            switchMap(() =>
                forkJoin(this.mapMembers$(ctx.getState().selectedCircle as Circle))
            ),
            tap(members => ctx.patchState({ members })),
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

    private mapMembers$(circle: Circle): Observable<Member>[] {
        return circle.voters.map(voter =>
            this.userService.x(voter.voter).pipe(
                map(res => ({
                    user: res.data,
                    voter
                }))
            ));
    }

}
