import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Action, Actions, NgxsOnInit, ofActionSuccessful, State, StateContext } from '@ngxs/store';
import { append, compose, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { AblyMessage, AblyService } from '@vyf/base';
import { UserService } from '@vyf/user-service';
import { Circle, CircleCandidatesFilter, CircleVotersFilter, Ranking, VoteCircleService } from '@vyf/vote-circle-service';
import { debounceTime, forkJoin, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { MemberAction } from '../../../shared/state/actions/member.action';
import { Placement, RankingStateModel } from '../models';
import { RankingAction } from './actions/ranking.action';

const DEFAULT_STATE: RankingStateModel = {
    selectedCircle: undefined,
    placements: []
};

@State<RankingStateModel>({
    name: 'ranking',
    defaults: DEFAULT_STATE
})
@Injectable()
export class RankingState implements NgxsOnInit {
    private readonly voteCircleService = inject(VoteCircleService);
    private readonly userService = inject(UserService);
    private readonly ablyService = inject(AblyService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly actions$ = inject(Actions);

    private readonly _rankingChangedMsgSubject = new Subject<AblyMessage>();
    private readonly _rankingChangedMessage$: Observable<AblyMessage>;

    constructor() {
        this._rankingChangedMessage$ = this._rankingChangedMsgSubject.asObservable();
    }

    @Action(RankingAction.SelectCircle)
    private selectCircle(
        ctx: StateContext<RankingStateModel>,
        action: RankingAction.SelectCircle
    ): Observable<Circle> {
        const { selectedCircle } = ctx.getState();

        if (selectedCircle && selectedCircle.id === action.circleId) {
            return of(selectedCircle);
        }

        const candidatesFilter: Partial<CircleCandidatesFilter> = {
            hasBeenVoted: false,
            shouldContainUser: true
        };

        const votersFilter: Partial<CircleVotersFilter> = {
            hasBeenVoted: false,
            shouldContainUser: true
        };

        return ctx.dispatch([
            new RankingAction.FetchCircle(action.circleId),
            new RankingAction.FetchRankings(action.circleId),
            new MemberAction.Ranking.FilterCandidateMembers(action.circleId, candidatesFilter),
            new MemberAction.Ranking.FilterVoterMembers(action.circleId, votersFilter)
        ]).pipe(
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

    @Action(RankingAction.FetchRankings)
    private fetchRankings(
        ctx: StateContext<RankingStateModel>,
        action: RankingAction.FetchRankings
    ): Observable<Placement[]> {
        return this.voteCircleService.rankings(action.circleId).pipe(
            map(res => res.data),
            switchMap(rankings => {
                if (rankings.length > 0) {
                    return forkJoin(this.mapRankings$(rankings));
                }
                return of([]);
            }),
            tap((placements) => {
                ctx.patchState({
                    placements
                });
            })
        );
    }

    @Action(RankingAction.SubscribeRankingsChangeEvent)
    private subscribeRankingsChangeEvent(
        ctx: StateContext<RankingStateModel>
    ) {
        const { selectedCircle } = ctx.getState();

        const channel = this.ablyService.channel(`circle-${selectedCircle?.id}:rankings`);

        return this.ablyService.subscribeToChannel(channel, 'ranking-changed', this._rankingChangedMsgSubject);
    }

    @Action(RankingAction.RankingChanged)
    private rankingChanged(
        ctx: StateContext<RankingStateModel>,
        action: RankingAction.RankingChanged
    ) {
        const placements = ctx.getState().placements;
//delete ranking member candidate from has to be voters if he has been voted
        const rankedIndex = placements.findIndex(placement => placement.ranking.number === action.ranking.number);

        if (rankedIndex === -1) {
            return this.mapRanking$(action.ranking).pipe(
                tap(placement => {
                    ctx.setState(
                        patch<RankingStateModel>({
                            placements: append<Placement>([placement])
                        })
                    );
                })
            );
        }

        return ctx.setState(
            compose<RankingStateModel>(
                patch<RankingStateModel>({
                    placements: removeItem<Placement>(placement => placement.ranking.id === action.ranking.id)
                }),
                patch<RankingStateModel>({
                    placements: insertItem<Placement>(placements[rankedIndex], rankedIndex)
                }),
                patch<RankingStateModel>({
                    placements: updateItem<Placement>(
                        placement => placement.ranking.id === action.ranking.id,
                        placement => ({ ...placement, ranking: { ...action.ranking } })
                    )
                })
            )
        );
    }

    public ngxsOnInit(ctx: StateContext<RankingStateModel>): void {
        this.actions$.pipe(
            ofActionSuccessful(RankingAction.FetchRankings),
            debounceTime(450),
            switchMap(() => this.ablyService.authorize$()),
            switchMap(() => ctx.dispatch(new RankingAction.SubscribeRankingsChangeEvent())),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this._rankingChangedMessage$.pipe(
            map(msg => msg.data as Ranking),
            tap(ranking => ctx.dispatch(new RankingAction.RankingChanged(ranking))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

    private mapRankings$(rankings: Ranking[]): Observable<Placement>[] {
        return rankings.map(ranking => this.mapRanking$(ranking));
    }

    private mapRanking$(ranking: Ranking): Observable<Placement> {
        return this.userService.x(ranking.identityId).pipe(
            map(res => ({
                user: res.data,
                ranking
            }))
        );
    }

}
