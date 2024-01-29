import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { SnackbarService } from '@vyf/base';
import { SnackbarSuccessComponent, SnackbarSuccessComponentData } from '@vyf/component';
import { User, UserService } from '@vyf/user-service';
import { Candidate, VoteCircleService, VoteCreateRequest, Voter } from '@vyf/vote-circle-service';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { UserSelectors } from '../../modules/user/state/user.selectors';
import { CandidateMember, MemberStateModel, VoterMember } from '../models';
import { MemberAction } from './actions/member.action';

const DEFAULT_STATE: MemberStateModel = {
    circleVoterMembers: [],
    circleUserVoterMember: undefined,
    circleCandidateMembers: [],
    circleUserCandidateMember: undefined,
    rankingVoterMembers: [],
    rankingUserVoterMember: undefined,
    rankingCandidateNeedVoteMembers: []
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
    private readonly snackbar = inject(SnackbarService);

    @Action(MemberAction.Circle.FilterVoterMembers)
    private filterCircleVoterMembers(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Circle.FilterVoterMembers
    ) {
        return ctx.dispatch(new MemberAction.Circle.FetchVoter(action.circleId, action.votersFilter));
    }

    @Action(MemberAction.Circle.FilterCandidateMembers)
    private filterCircleCandidateMembers(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Circle.FilterCandidateMembers
    ) {
        return ctx.dispatch(new MemberAction.Circle.FetchCandidate(action.circleId, action.candidatesFilter));
    }

    @Action(MemberAction.Ranking.FilterVoterMembers)
    private filterRankingVoterMembers(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.FilterVoterMembers
    ) {
        return ctx.dispatch(new MemberAction.Ranking.FetchVoter(action.circleId, action.votersFilter));
    }

    @Action(MemberAction.Ranking.FilterCandidateNeedVoteMembers)
    private filterRankingCandidateMembers(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.FilterCandidateNeedVoteMembers
    ) {
        return ctx.dispatch(new MemberAction.Ranking.FetchCandidate(action.circleId, action.candidatesFilter));
    }

    @Action(MemberAction.Vote)
    private vote(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Vote
    ): Observable<boolean> {
        const voteCreateRequest: VoteCreateRequest = {
            candidateId: action.candidateIdentId
        };

        return this.voteCircleService.createVote(action.circleId, voteCreateRequest).pipe(
            map(res => res.data),
            tap(() => {
                ctx.setState(
                    patch<MemberStateModel>({
                        rankingCandidateNeedVoteMembers: removeItem<CandidateMember>(member => member.candidate.candidate === action.candidateIdentId)
                    })
                );
            }),
            tap(() => {
                const rankingUserVoterMember = ctx.getState().rankingUserVoterMember;
                if (rankingUserVoterMember) {
                    ctx.setState(
                        patch<MemberStateModel>({
                            rankingUserVoterMember: {
                                ...rankingUserVoterMember,
                                voter: {
                                    ...rankingUserVoterMember.voter,
                                    votedFor: action.candidateIdentId
                                }
                            }
                        })
                    );
                }
            }),
            tap(() => {
                const data: SnackbarSuccessComponentData = {
                    message: 'Thank you! You\'re vote has been placed.'
                };
                this.snackbar.openSuccess(SnackbarSuccessComponent, data);
            })
        );
    }

    @Action(MemberAction.JoinedAsVoter)
    private joinedAsVoterInCircle(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.JoinedAsVoter
    ) {
        const user = this.getCurrentUser();

        const member: VoterMember = {
            user,
            voter: action.voter
        };

        return ctx.setState(
            patch<MemberStateModel>({
                circleVoterMembers: append<VoterMember>([member]),
                rankingVoterMembers: append<VoterMember>([member])
            })
        );
    }

    @Action(MemberAction.JoinedAsCandidate)
    private joinedAsCandidateInCircle(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.JoinedAsCandidate
    ) {
        const user = this.getCurrentUser();
        const member: CandidateMember = {
            user,
            candidate: action.candidate
        };

        return ctx.setState(
            patch<MemberStateModel>({
                circleCandidateMembers: append<CandidateMember>([member]),
                rankingCandidateNeedVoteMembers: append<CandidateMember>([member])
            })
        );
    }

    @Action(MemberAction.Committed)
    private committedForCircle(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Committed
    ) {
        const user = this.getCurrentUser();
        const userMember = ctx.getState().circleUserCandidateMember as CandidateMember;

        return ctx.setState(
            patch<MemberStateModel>({
                circleCandidateMembers: updateItem<CandidateMember>(
                    member => member.user.identityId === user.identityId,
                    member => ({ ...member, voter: { ...member.candidate, commitment: action.commitment } })
                ),
                circleUserCandidateMember: {
                    ...userMember,
                    candidate: {
                        ...userMember!.candidate,
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
                if (!circleVoter.voters.length) {
                    return of([] as VoterMember[]).pipe(
                        tap(members => ctx.patchState({ circleVoterMembers: members })),
                        map(() => circleVoter)
                    );
                }

                return forkJoin(this.mapVoterMembers$(circleVoter.voters)).pipe(
                    tap(members => ctx.patchState({ circleVoterMembers: members })),
                    map(() => circleVoter)
                );
            }),
            switchMap(circleVoter => {
                if (circleVoter.userVoter === null) {
                    return of(ctx.patchState({ circleUserVoterMember: undefined }));
                }

                return this.mapVoterMember$(circleVoter.userVoter).pipe(
                    tap(member => ctx.patchState({ circleUserVoterMember: member }))
                );
            })
        );
    }

    @Action(MemberAction.Circle.FetchCandidate)
    private fetchCircleCandidate(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Circle.FetchCandidate
    ) {
        return this.voteCircleService.circleCandidates(action.circleId, action.filter).pipe(
            map(res => res.data),
            switchMap(circleCandidate => {
                if (!circleCandidate.candidates.length) {
                    return of([] as CandidateMember[]).pipe(
                        tap(members => ctx.patchState({ circleCandidateMembers: members })),
                        map(() => circleCandidate)
                    );
                }

                return forkJoin(this.mapCandidateMembers$(circleCandidate.candidates)).pipe(
                    tap(members => ctx.patchState({ circleCandidateMembers: members })),
                    map(() => circleCandidate)
                );
            }),
            switchMap(circleCandidate => {
                if (circleCandidate.userCandidate === null) {
                    return of(ctx.patchState({ circleUserCandidateMember: undefined }));
                }

                return this.mapCandidateMember$(circleCandidate.userCandidate).pipe(
                    tap(member => ctx.patchState({ circleUserCandidateMember: member }))
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
                if (!circleVoter.voters) {
                    return of([] as VoterMember[]).pipe(
                        tap(members => ctx.patchState({ rankingVoterMembers: members })),
                        map(() => circleVoter)
                    );
                }

                return forkJoin(this.mapVoterMembers$(circleVoter.voters)).pipe(
                    tap(members => ctx.patchState({ rankingVoterMembers: members })),
                    map(() => circleVoter)
                );
            }),
            switchMap(circleVoter => {
                if (circleVoter.userVoter === null) {
                    return of(ctx.patchState({ rankingUserVoterMember: undefined }));
                }

                return this.mapVoterMember$(circleVoter.userVoter).pipe(
                    tap(member => ctx.patchState({ rankingUserVoterMember: member }))
                );
            })
        );
    }

    @Action(MemberAction.Ranking.FetchCandidate)
    private fetchRankingCandidate(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.FetchCandidate
    ) {
        return this.voteCircleService.circleCandidates(action.circleId, action.filter).pipe(
            map(res => res.data),
            switchMap(circleCandidate => {
                if (!circleCandidate.candidates.length) {
                    return of([] as CandidateMember[]).pipe(
                        tap(members => ctx.patchState({ rankingCandidateNeedVoteMembers: members })),
                        map(() => circleCandidate)
                    );
                }

                return forkJoin(this.mapCandidateMembers$(circleCandidate.candidates)).pipe(
                    tap(members => ctx.patchState({ rankingCandidateNeedVoteMembers: members })),
                    map(() => circleCandidate)
                );
            })
        );
    }

    private mapVoterMembers$(voters: Voter[]): Observable<VoterMember>[] {
        return voters.map(voter => this.mapVoterMember$(voter));
    }

    private mapVoterMember$(voter: Voter): Observable<VoterMember> {
        return this.userService.x(voter.voter).pipe(
            map(res => ({
                user: res.data,
                voter
            }))
        );
    }

    private mapCandidateMembers$(candidates: Candidate[]): Observable<CandidateMember>[] {
        return candidates.map(candidate => this.mapCandidateMember$(candidate));
    }

    private mapCandidateMember$(candidate: Candidate): Observable<CandidateMember> {
        return this.userService.x(candidate.candidate).pipe(
            map(res => ({
                user: res.data,
                candidate
            }))
        );
    }

    private getCurrentUser(): User {
        const user = this.store.selectSnapshot(UserSelectors.slices.user);
        if (!user) {
            throw Error('could not select current user.');
        }
        return user;
    }
}
