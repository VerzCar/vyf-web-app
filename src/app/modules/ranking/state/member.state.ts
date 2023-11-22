import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { patch, removeItem } from '@ngxs/store/operators';
import { UserService } from '@vyf/user-service';
import {
    VoteCircleService,
    VoteCreateRequest,
    Voter
} from '@vyf/vote-circle-service';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { Member, MemberStateModel } from '../models'
import { MemberAction } from './actions/member.action';

const DEFAULT_STATE: MemberStateModel = {
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

    @Action(MemberAction.FilterMembers)
    private filterMembers(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.FilterMembers
    ) {
        return ctx.dispatch(new MemberAction.FetchCircleVoter(action.circleId, action.votersFilter));
    }

    @Action(MemberAction.Vote)
    private vote(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Vote
    ): Observable<boolean> {
        const voteCreateRequest: VoteCreateRequest = {
            circleId: action.circleId,
            elected: action.electedIdentId
        };

        return this.voteCircleService.createVote(voteCreateRequest).pipe(
            map(res => res.data),
            tap(() => {
                const userMember = ctx.getState().userMember as Member;
                ctx.setState(
                    patch<MemberStateModel>({
                        members: removeItem<Member>(member => member.voter.voter === action.electedIdentId),
                        userMember: {
                            ...userMember,
                            voter: {
                                ...userMember!.voter,
                                votedFor: action.electedIdentId
                            }
                        }
                    })
                );
            })
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
                forkJoin(this.mapMembers$(circleVoter.voters ?? [])).pipe(
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
