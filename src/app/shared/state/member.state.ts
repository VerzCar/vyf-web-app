import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { AblyMessage, AblyService, isDefined, SnackbarService } from '@vyf/base';
import { SnackbarSuccessComponent, SnackbarSuccessComponentData } from '@vyf/component';
import { User, UserService } from '@vyf/user-service';
import { Candidate, Circle, CircleCandidateChangeEvent, CircleVoterChangeEvent, EventOperation, VoteCircleService, VoteCreateRequest, Voter } from '@vyf/vote-circle-service';
import { distinctUntilChanged, filter, forkJoin, map, Observable, of, pairwise, startWith, Subject, switchMap, tap } from 'rxjs';
import { CirclesSelectors } from '../../modules/circles/state/circles.selectors';
import { RankingSelectors } from '../../modules/ranking/state/ranking.selectors';
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

type SubscribeCandidateChangeAction = new (circleId: number) => MemberAction.Circle.SubscribeCandidateChangeEvent | MemberAction.Ranking.SubscribeCandidateChangeEvent;
type SubscribeVoterChangeAction = new (circleId: number) => MemberAction.Circle.SubscribeVoterChangeEvent | MemberAction.Ranking.SubscribeVoterChangeEvent;
type UnsubscribeCandidateChangeAction = new (circleId: number) => MemberAction.Circle.UnsubscribeCandidateChangeEvent | MemberAction.Ranking.UnsubscribeCandidateChangeEvent;
type UnsubscribeVoterChangeAction = new (circleId: number) => MemberAction.Circle.UnsubscribeVoterChangeEvent | MemberAction.Ranking.UnsubscribeVoterChangeEvent;
type SubscribeChangeActions = [SubscribeCandidateChangeAction, SubscribeVoterChangeAction];
type UnsubscribeChangeActions = [UnsubscribeCandidateChangeAction, UnsubscribeVoterChangeAction];

@State<MemberStateModel>({
    name: 'member',
    defaults: DEFAULT_STATE
})
@Injectable()
export class MemberState implements NgxsOnInit {
    private readonly voteCircleService = inject(VoteCircleService);
    private readonly userService = inject(UserService);
    private readonly store = inject(Store);
    private readonly destroyRef = inject(DestroyRef);
    private readonly snackbar = inject(SnackbarService);
    private readonly ablyService = inject(AblyService);

    private readonly _circleCandidateChangedMsgSubject = new Subject<AblyMessage>();
    private readonly _circleCandidateChangedMessage$: Observable<AblyMessage>;
    private readonly _rankingCandidateChangedMsgSubject = new Subject<AblyMessage>();
    private readonly _rankingCandidateChangedMessage$: Observable<AblyMessage>;
    private readonly _circleVoterChangedMsgSubject = new Subject<AblyMessage>();
    private readonly _circleVoterChangedMessage$: Observable<AblyMessage>;
    private readonly _rankingVoterChangedMsgSubject = new Subject<AblyMessage>();
    private readonly _rankingVoterChangedMessage$: Observable<AblyMessage>;

    constructor() {
        this._circleCandidateChangedMessage$ = this._circleCandidateChangedMsgSubject.asObservable();
        this._rankingCandidateChangedMessage$ = this._rankingCandidateChangedMsgSubject.asObservable();
        this._circleVoterChangedMessage$ = this._circleVoterChangedMsgSubject.asObservable();
        this._rankingVoterChangedMessage$ = this._rankingVoterChangedMsgSubject.asObservable();
    }

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

    @Action(MemberAction.Ranking.Vote)
    private vote(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.Vote
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
                const data: SnackbarSuccessComponentData = {
                    message: 'Thank you! Your vote has been placed.'
                };
                this.snackbar.openSuccess(SnackbarSuccessComponent, data);
            })
        );
    }

    @Action(MemberAction.Ranking.RevokeVote)
    private revokeVote(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.RevokeVote
    ): Observable<boolean> {
        return this.voteCircleService.revokeVote(action.circleId).pipe(
            map(res => res.data),
            tap(() => {
                const data: SnackbarSuccessComponentData = {
                    message: 'Your vote has been revoked.'
                };
                this.snackbar.openSuccess(SnackbarSuccessComponent, data);
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

    @Action(MemberAction.Circle.SubscribeCandidateChangeEvent)
    private circleSubscribeCandidateChangeEvent(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Circle.SubscribeCandidateChangeEvent
    ) {
        const channel = this.ablyService.channel(`circle-${action.circleId}:candidate`);
        return this.ablyService.subscribeToChannel(channel, 'circle-candidate-changed', this._circleCandidateChangedMsgSubject);
    }

    @Action(MemberAction.Circle.UnsubscribeCandidateChangeEvent)
    private circleUnsubscribeCandidateChangeEvent(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Circle.UnsubscribeCandidateChangeEvent
    ) {
        const channel = this.ablyService.channel(`circle-${action.circleId}:candidate`);
        return this.ablyService.unsubscribeFromChannel(channel);
    }

    @Action(MemberAction.Ranking.SubscribeCandidateChangeEvent)
    private rankingSubscribeCandidateChangeEvent(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.SubscribeCandidateChangeEvent
    ) {
        const channel = this.ablyService.channel(`circle-${action.circleId}:candidate`);
        return this.ablyService.subscribeToChannel(channel, 'circle-candidate-changed', this._rankingCandidateChangedMsgSubject);
    }

    @Action(MemberAction.Ranking.UnsubscribeCandidateChangeEvent)
    private rankingUnsubscribeCandidateChangeEvent(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.UnsubscribeCandidateChangeEvent
    ) {
        const channel = this.ablyService.channel(`circle-${action.circleId}:candidate`);
        return this.ablyService.unsubscribeFromChannel(channel);
    }

    @Action(MemberAction.Circle.SubscribeVoterChangeEvent)
    private circleSubscribeVoterChangeEvent(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Circle.SubscribeVoterChangeEvent
    ) {
        const channel = this.ablyService.channel(`circle-${action.circleId}:voter`);
        return this.ablyService.subscribeToChannel(channel, 'circle-voter-changed', this._circleVoterChangedMsgSubject);
    }

    @Action(MemberAction.Circle.UnsubscribeVoterChangeEvent)
    private circleUnsubscribeVoterChangeEvent(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Circle.UnsubscribeVoterChangeEvent
    ) {
        const channel = this.ablyService.channel(`circle-${action.circleId}:voter`);
        return this.ablyService.unsubscribeFromChannel(channel);
    }

    @Action(MemberAction.Ranking.SubscribeVoterChangeEvent)
    private rankingSubscribeVoterChangeEvent(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.SubscribeVoterChangeEvent
    ) {
        const channel = this.ablyService.channel(`circle-${action.circleId}:voter`);
        return this.ablyService.subscribeToChannel(channel, 'circle-voter-changed', this._rankingVoterChangedMsgSubject);
    }

    @Action(MemberAction.Ranking.UnsubscribeVoterChangeEvent)
    private rankingUnsubscribeVoterChangeEvent(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.UnsubscribeVoterChangeEvent
    ) {
        const channel = this.ablyService.channel(`circle-${action.circleId}:voter`);
        return this.ablyService.unsubscribeFromChannel(channel);
    }

    @Action(MemberAction.Circle.CandidateChanged)
    private circleCandidateChanged(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Circle.CandidateChanged
    ) {
        console.log('circleCandidateChanged', action.candidateEvent);
        switch (action.candidateEvent.operation) {
            case EventOperation.Created: {
                const user = this.getCurrentUser();
                let userMember = ctx.getState().circleUserCandidateMember;

                if (user.identityId === action.candidateEvent.candidate.candidate) {
                    userMember = {
                        user,
                        candidate: action.candidateEvent.candidate
                    };

                    return ctx.setState(
                        patch<MemberStateModel>({
                            circleCandidateMembers: append<CandidateMember>([userMember]),
                            circleUserCandidateMember: userMember
                        })
                    );
                }

                return this.mapCandidateMember$(action.candidateEvent.candidate).pipe(
                    tap(member => ctx.setState(
                        patch<MemberStateModel>({
                            circleCandidateMembers: append<CandidateMember>([member]),
                            circleUserCandidateMember: userMember
                        })
                    ))
                );
            }
            case EventOperation.Updated: {
                const user = this.getCurrentUser();
                let userMember = ctx.getState().circleUserCandidateMember;

                if (user.identityId === action.candidateEvent.candidate.candidate) {
                    const circleUserCandidateMember = ctx.getState().circleUserCandidateMember as CandidateMember;
                    userMember = {
                        ...circleUserCandidateMember,
                        candidate: action.candidateEvent.candidate
                    };
                }

                return ctx.setState(
                    patch<MemberStateModel>({
                        circleCandidateMembers: updateItem<CandidateMember>(
                            member => member.user.identityId === user.identityId,
                            member => ({ ...member, candidate: action.candidateEvent.candidate })
                        ),
                        circleUserCandidateMember: userMember
                    })
                );
            }
            case EventOperation.Deleted: {
                const user = this.getCurrentUser();
                let userMember = ctx.getState().circleUserCandidateMember;

                if (user.identityId === action.candidateEvent.candidate.candidate) {
                    userMember = undefined;
                }

                return ctx.setState(
                    patch<MemberStateModel>({
                        circleCandidateMembers: removeItem<CandidateMember>(member => member.candidate.id === action.candidateEvent.candidate.id),
                        circleUserCandidateMember: userMember
                    })
                );
            }
        }
    }

    @Action(MemberAction.Ranking.CandidateChanged)
    private rankingCandidateChanged(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.CandidateChanged
    ) {
        console.log('rankingCandidateChanged', action.candidateEvent);
        switch (action.candidateEvent.operation) {
            case EventOperation.Created: {
                const user = this.getCurrentUser();
                let userMember = ctx.getState().circleUserCandidateMember;

                if (user.identityId === action.candidateEvent.candidate.candidate) {
                    userMember = {
                        user,
                        candidate: action.candidateEvent.candidate
                    };

                    return ctx.setState(
                        patch<MemberStateModel>({
                            rankingCandidateNeedVoteMembers: append<CandidateMember>([userMember])
                        })
                    );
                }

                return this.mapCandidateMember$(action.candidateEvent.candidate).pipe(
                    tap(member => ctx.setState(
                        patch<MemberStateModel>({
                            rankingCandidateNeedVoteMembers: append<CandidateMember>([member])
                        })
                    ))
                );
            }
            case EventOperation.Updated: {
                const user = this.getCurrentUser();

                return ctx.setState(
                    patch<MemberStateModel>({
                        rankingCandidateNeedVoteMembers: updateItem<CandidateMember>(
                            member => member.user.identityId === user.identityId,
                            member => ({ ...member, candidate: action.candidateEvent.candidate })
                        )
                    })
                );
            }
            case EventOperation.Deleted: {
                return ctx.setState(
                    patch<MemberStateModel>({
                        rankingCandidateNeedVoteMembers: removeItem<CandidateMember>(member => member.candidate.id === action.candidateEvent.candidate.id)
                    })
                );
            }
        }
    }

    @Action(MemberAction.Circle.VoterChanged)
    private circleVoterChanged(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Circle.VoterChanged
    ) {
        console.log('circleVoterChanged', action.voterEvent);
        switch (action.voterEvent.operation) {
            case EventOperation.Created: {
                const user = this.getCurrentUser();
                let userMember = ctx.getState().circleUserVoterMember;

                if (user.identityId === action.voterEvent.voter.voter) {
                    userMember = {
                        user,
                        voter: action.voterEvent.voter
                    };

                    return ctx.setState(
                        patch<MemberStateModel>({
                            circleVoterMembers: append<VoterMember>([userMember]),
                            circleUserVoterMember: userMember
                        })
                    );
                }

                return this.mapVoterMember$(action.voterEvent.voter).pipe(
                    tap(member => ctx.setState(
                        patch<MemberStateModel>({
                            circleVoterMembers: append<VoterMember>([member]),
                            circleUserVoterMember: userMember
                        })
                    ))
                );
            }
            case EventOperation.Updated: {
                const user = this.getCurrentUser();
                let userMember = ctx.getState().circleUserVoterMember;

                if (user.identityId === action.voterEvent.voter.voter) {
                    userMember = {
                        user,
                        voter: action.voterEvent.voter
                    };

                    return ctx.setState(
                        patch<MemberStateModel>({
                            circleVoterMembers: updateItem<VoterMember>(
                                member => member.voter.id === action.voterEvent.voter.id,
                                member => ({ ...member, voter: action.voterEvent.voter })
                            ),
                            circleUserVoterMember: userMember
                        })
                    );
                }

                return this.mapVoterMember$(action.voterEvent.voter).pipe(
                    tap(member => ctx.setState(
                        patch<MemberStateModel>({
                            circleVoterMembers: updateItem<VoterMember>(
                                member => member.voter.id === action.voterEvent.voter.id, member
                            ),
                            circleUserVoterMember: userMember
                        })
                    ))
                );
            }
            case EventOperation.Deleted: {
                const user = this.getCurrentUser();
                let userMember = ctx.getState().circleUserVoterMember;

                if (user.identityId === action.voterEvent.voter.voter) {
                    userMember = undefined;
                }

                return ctx.setState(
                    patch<MemberStateModel>({
                        circleVoterMembers: removeItem<VoterMember>(member => member.voter.id === action.voterEvent.voter.id),
                        circleUserVoterMember: userMember
                    })
                );
            }
        }
    }

    @Action(MemberAction.Ranking.VoterChanged)
    private rankingVoterChanged(
        ctx: StateContext<MemberStateModel>,
        action: MemberAction.Ranking.VoterChanged
    ) {
        console.log('rankingVoterChanged', action.voterEvent);
        switch (action.voterEvent.operation) {
            case EventOperation.Created: {
                const user = this.getCurrentUser();
                let userMember = ctx.getState().circleUserVoterMember;

                if (user.identityId === action.voterEvent.voter.voter) {
                    userMember = {
                        user,
                        voter: action.voterEvent.voter
                    };

                    return ctx.setState(
                        patch<MemberStateModel>({
                            rankingVoterMembers: append<VoterMember>([userMember]),
                            rankingUserVoterMember: userMember
                        })
                    );
                }

                return this.mapVoterMember$(action.voterEvent.voter).pipe(
                    tap(member => ctx.setState(
                        patch<MemberStateModel>({
                            rankingVoterMembers: append<VoterMember>([member]),
                            rankingUserVoterMember: userMember
                        })
                    ))
                );
            }
            case EventOperation.Updated: {
                const user = this.getCurrentUser();
                let userMember = ctx.getState().circleUserVoterMember;

                if (user.identityId === action.voterEvent.voter.voter) {
                    userMember = {
                        user,
                        voter: action.voterEvent.voter
                    };

                    return ctx.setState(
                        patch<MemberStateModel>({
                            rankingVoterMembers: updateItem<VoterMember>(
                                member => member.voter.id === action.voterEvent.voter.id,
                                member => ({ ...member, voter: action.voterEvent.voter })
                            ),
                            rankingUserVoterMember: userMember
                        })
                    );
                }

                return this.mapVoterMember$(action.voterEvent.voter).pipe(
                    tap(member => ctx.setState(
                        patch<MemberStateModel>({
                            rankingVoterMembers: updateItem<VoterMember>(
                                member => member.voter.id === action.voterEvent.voter.id, member
                            ),
                            rankingUserVoterMember: userMember
                        })
                    ))
                );
            }
            case EventOperation.Deleted: {
                const user = this.getCurrentUser();
                let userMember = ctx.getState().circleUserVoterMember;

                if (user.identityId === action.voterEvent.voter.voter) {
                    userMember = undefined;
                }

                return ctx.setState(
                    patch<MemberStateModel>({
                        rankingVoterMembers: removeItem<VoterMember>(member => member.voter.id === action.voterEvent.voter.id),
                        rankingUserVoterMember: userMember
                    })
                );
            }
        }
    }

    public ngxsOnInit(ctx: StateContext<MemberStateModel>): void {
        this.changedEvent$(
            ctx,
            this.store.select(CirclesSelectors.slices.selectedCircle).pipe(
                startWith(this.store.selectSnapshot(CirclesSelectors.slices.selectedCircle))),
            [MemberAction.Circle.SubscribeCandidateChangeEvent, MemberAction.Circle.SubscribeVoterChangeEvent],
            [MemberAction.Circle.UnsubscribeCandidateChangeEvent, MemberAction.Circle.UnsubscribeVoterChangeEvent]
        ).subscribe();

        this.changedEvent$(
            ctx,
            this.store.select(RankingSelectors.slices.selectedCircle).pipe(
                startWith(this.store.selectSnapshot(RankingSelectors.slices.selectedCircle))),
            [MemberAction.Ranking.SubscribeCandidateChangeEvent, MemberAction.Ranking.SubscribeVoterChangeEvent],
            [MemberAction.Ranking.UnsubscribeCandidateChangeEvent, MemberAction.Ranking.UnsubscribeVoterChangeEvent]
        ).subscribe();

        this._circleCandidateChangedMessage$.pipe(
            map(msg => msg.data as CircleCandidateChangeEvent),
            tap(event => ctx.dispatch(new MemberAction.Circle.CandidateChanged(event))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this._rankingCandidateChangedMessage$.pipe(
            map(msg => msg.data as CircleCandidateChangeEvent),
            tap(event => ctx.dispatch(new MemberAction.Ranking.CandidateChanged(event))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this._circleVoterChangedMessage$.pipe(
            map(msg => msg.data as CircleVoterChangeEvent),
            tap(event => ctx.dispatch(new MemberAction.Circle.VoterChanged(event))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this._rankingVoterChangedMessage$.pipe(
            map(msg => msg.data as CircleVoterChangeEvent),
            tap(event => ctx.dispatch(new MemberAction.Ranking.VoterChanged(event))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
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

    private changedEvent$(
        ctx: StateContext<MemberStateModel>,
        source$: Observable<Circle | undefined>,
        subscribeActions: SubscribeChangeActions,
        unsubscribeActions: UnsubscribeChangeActions
    ): Observable<void> {
        return source$.pipe(
            startWith(this.store.selectSnapshot(RankingSelectors.slices.selectedCircle)),
            pairwise(),
            distinctUntilChanged(),
            filter(([, curr]) => isDefined(curr)),
            switchMap(([prev, curr]) => {
                    let action$: Observable<void>;

                    if (prev) {
                        action$ = ctx.dispatch([
                            new unsubscribeActions[0](prev.id),
                            new unsubscribeActions[1](prev.id)
                        ]);
                    } else {
                        action$ = of(void 0);
                    }

                    return action$.pipe(map(() => [prev, curr]));
                }
            ),
            switchMap(([, curr]) => ctx.dispatch([
                new subscribeActions[0](curr!.id),
                new subscribeActions[1](curr!.id)
            ])),
            takeUntilDestroyed(this.destroyRef));
    }

    private getCurrentUser(): User {
        const user = this.store.selectSnapshot(UserSelectors.slices.user);
        if (!user) {
            throw Error('could not select current user.');
        }
        return user;
    }
}
