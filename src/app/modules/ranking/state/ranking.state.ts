import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Action, Actions, NgxsOnInit, ofActionSuccessful, State, StateContext, StateOperator } from '@ngxs/store';
import { compose, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { AblyMessage, AblyService } from '@vyf/base';
import { UserService } from '@vyf/user-service';
import { Circle, CircleCandidatesFilter, EventOperation, Ranking, RankingChangeEvent, VoteCircleService } from '@vyf/vote-circle-service';
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
            hasBeenVoted: false
        };

        return ctx.dispatch([
            new RankingAction.FetchCircle(action.circleId),
            new RankingAction.FetchRankings(action.circleId),
            new MemberAction.Ranking.FilterCandidateNeedVoteMembers(action.circleId, candidatesFilter),
            new MemberAction.Ranking.FilterVoterMembers(action.circleId)
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
                    return forkJoin(this.mapRankingsToPlacements$(rankings));
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
        console.log('RANKING: ', action.rankingEvent);

        switch (action.rankingEvent.operation) {
            case EventOperation.Created:
            case EventOperation.Updated: {
                const placements = ctx.getState().placements;
                const ranking = action.rankingEvent.ranking;

                // check if the placement for the ranking already exists, if not create new placement
                const rankedIndex = placements.findIndex(placement => placement.ranking.id === ranking.id);

                const rankedPlacement$ = rankedIndex === -1 ? this.mapRankingToPlacement$(ranking) : of(placements[rankedIndex]);

                return rankedPlacement$.pipe(
                    tap(placement =>
                        ctx.setState(
                            compose<RankingStateModel>(
                                patch<RankingStateModel>({
                                    placements: removeItem<Placement>(placement => placement.ranking.id === ranking.id)
                                }),
                                patch<RankingStateModel>({
                                    placements: insertItem<Placement>({ ...placement, ranking: { ...ranking } }, ranking.indexedOrder)
                                })
                            )
                        )
                    ),
                    tap(() =>
                        ctx.setState(
                            patch({
                                placements: compose(...this.toUpdatePlacementOperators(ctx, ranking))
                            })
                        )
                    )
                );
            }
            case EventOperation.Deleted: {
                ctx.setState(
                    patch<RankingStateModel>({
                        placements: removeItem<Placement>(placement => placement.ranking.id === action.rankingEvent.ranking.id)
                    })
                );

                // TODO: when deleted there exists no index - refactor what to do then for update of placements
                const ranking = action.rankingEvent.ranking;

                return ctx.setState(
                    patch({
                        placements: compose(...this.toUpdatePlacementOperators(ctx, ranking))
                    })
                );
            }
            case EventOperation.Repositioned: {
                return;
            }
        }
    }

    public ngxsOnInit(ctx: StateContext<RankingStateModel>): void {
        this.actions$.pipe(
            ofActionSuccessful(RankingAction.FetchRankings),
            debounceTime(450),
            switchMap(() => ctx.dispatch(new RankingAction.SubscribeRankingsChangeEvent())),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this._rankingChangedMessage$.pipe(
            map(msg => msg.data as RankingChangeEvent),
            tap(ranking => ctx.dispatch(new RankingAction.RankingChanged(ranking))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

    private mapRankingsToPlacements$(rankings: Ranking[]): Observable<Placement>[] {
        return rankings.map(ranking => this.mapRankingToPlacement$(ranking));
    }

    private mapRankingToPlacement$(ranking: Ranking): Observable<Placement> {
        return this.userService.x(ranking.identityId).pipe(
            map(res => ({
                user: res.data,
                ranking
            }))
        );
    }

    private toUpdatePlacementOperators(
        ctx: StateContext<RankingStateModel>,
        ranking: Ranking
    ): StateOperator<Placement[]>[] {
        const updateItems: StateOperator<Placement[]>[] = [];
        const placements = ctx.getState().placements;
        const placementsLength = placements.length;
        const afterStartIndex = (ranking.indexedOrder + 1) > placementsLength ? placementsLength : ranking.indexedOrder + 1;

        let numberPlacement = ranking.number;
        let votes = ranking.votes;

        // update all items after the newly inserted placement
        for (let i = afterStartIndex; i < placementsLength; i++) {
            const placement = placements[i];

            if (placement.ranking.votes < votes) {
                votes = placement.ranking.votes;
                const updatedPlacement = {
                    ...placement,
                    ranking: {
                        ...placement.ranking,
                        number: numberPlacement + 1,
                        indexedOrder: i
                    }
                };
                numberPlacement = updatedPlacement.ranking.number;
                updateItems.push(updateItem<Placement>(i, patch(updatedPlacement)));
            }
        }

        const beforeStartIndex = (ranking.indexedOrder - 1) < 0 ? 0 : ranking.indexedOrder - 1;
        numberPlacement = ranking.number;
        votes = ranking.votes;

        // update all items before the newly inserted placement
        for (let i = beforeStartIndex; i >= 0; i--) {
            const placement = placements[i];

            if (placement.ranking.votes === votes) {
                const updatedPlacement = {
                    ...placement,
                    ranking: {
                        ...placement.ranking,
                        number: numberPlacement,
                        indexedOrder: i
                    }
                };
                updateItems.push(updateItem<Placement>(i, patch(updatedPlacement)));
            } else {
                i = -1;
            }
        }

        return updateItems;
    }

}
