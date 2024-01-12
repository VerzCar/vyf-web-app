import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { UserService } from '@vyf/user-service';
import { VoteCircleService, VoteCreateRequest, Voter } from '@vyf/vote-circle-service';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { UserSelectors } from '../../modules/user/state/user.selectors';
import { Member, MemberStateModel } from '../models';
import { MemberAction } from './actions/member.action';

const DEFAULT_STATE: MemberStateModel = {
    circleMembers: undefined,
    circleUserMember: undefined,
    rankingMembers: undefined,
    rankingUserMember: undefined
};

@State<MemberStateModel>({
    name: 'member',
    defaults: DEFAULT_STATE
})
@Injectable()
export class MemberState {
    private readonly voteCircleService = inject(VoteCircleService);
    private readonly userService = inject(UserService);
    private readonly store = inject(Store);

    @Action(MemberAction.Circle.FilterMembers)
    private filterCircleMembers(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Circle.FilterMembers
    ) {
        return ctx.dispatch(new MemberAction.Circle.FetchVoter(action.circleId, action.votersFilter));
    }

    @Action(MemberAction.Ranking.FilterMembers)
    private filterRankingMembers(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.FilterMembers
    ) {
        return ctx.dispatch(new MemberAction.Ranking.FetchVoter(action.circleId, action.votersFilter));
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
                const userMember = ctx.getState().circleUserMember as Member;
                ctx.setState(
                    patch<MemberStateModel>({
                        circleMembers: removeItem<Member>(member => member.voter.voter === action.electedIdentId),
                        circleUserMember: {
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

    @Action(MemberAction.Join)
    private joinedInCircle(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Join
    ) {
        const user = this.store.selectSnapshot(UserSelectors.slices.user);

        if (!user) {
            throw Error('could not select current user.');
        }

        const member: Member = {
            user,
            voter: action.voter
        };

        return ctx.setState(
            patch<MemberStateModel>({
                circleMembers: append<Member>([member]),
                rankingMembers: append<Member>([member])
            })
        );
    }

    @Action(MemberAction.Circle.Committed)
    private committedForCircle(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Circle.Committed
    ) {
        const user = this.store.selectSnapshot(UserSelectors.slices.user);

        if (!user) {
            throw Error('could not select current user.');
        }

        const userMember = ctx.getState().circleUserMember as Member;

        return ctx.setState(
            patch<MemberStateModel>({
                circleMembers: updateItem<Member>(
                    member => member.user.identityId === user.identityId,
                    member => ({ ...member, voter: { ...member.voter, commitment: action.commitment } })
                ),
                circleUserMember: {
                    ...userMember,
                    voter: {
                        ...userMember!.voter,
                        commitment: action.commitment
                    }
                }
            })
        );
    }

    @Action(MemberAction.Circle.FetchVoter)
    private fetchCircleVoter(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Circle.FetchVoter
    ) {
        return this.voteCircleService.circleVoters(action.circleId, action.filter).pipe(
            map(res => res.data),
            switchMap(circleVoter => {
                if (circleVoter.voters === null) {
                    return of([] as Member[]).pipe(
                        tap(members => ctx.patchState({ circleMembers: members })),
                        map(() => circleVoter)
                    );
                }

                return forkJoin(this.mapMembers$(circleVoter.voters)).pipe(
                    tap(members => ctx.patchState({ circleMembers: members })),
                    map(() => circleVoter)
                );
            }),
            switchMap(circleVoter => {
                if (circleVoter.userVoter === null) {
                    return of(ctx.patchState({ circleUserMember: undefined }));
                }

                return this.mapMember$(circleVoter.userVoter).pipe(
                    tap(member => ctx.patchState({ circleUserMember: member }))
                );
            })
        );
    }

    @Action(MemberAction.Ranking.FetchVoter)
    private fetchRankingVoter(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.FetchVoter
    ) {
        return this.voteCircleService.circleVoters(action.circleId, action.filter).pipe(
            map(res => res.data),
            switchMap(circleVoter => {
                if (circleVoter.voters === null) {
                    return of([] as Member[]).pipe(
                        tap(members => ctx.patchState({ rankingMembers: members })),
                        map(() => circleVoter)
                    );
                }

                return forkJoin(this.mapMembers$(circleVoter.voters)).pipe(
                    tap(members => ctx.patchState({ rankingMembers: members })),
                    map(() => circleVoter)
                );
            }),
            switchMap(circleVoter => {
                if (circleVoter.userVoter === null) {
                    return of(ctx.patchState({ rankingUserMember: undefined }));
                }

                return this.mapMember$(circleVoter.userVoter).pipe(
                    tap(member => ctx.patchState({ rankingUserMember: member }))
                );
            })
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
