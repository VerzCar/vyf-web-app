import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Action, Actions, NgxsOnInit, ofActionSuccessful, State, StateContext } from '@ngxs/store';
import { append, compose, insertItem, patch, removeItem } from '@ngxs/store/operators';
import { AblyMessage, AblyService } from '@vyf/base';
import { UserService } from '@vyf/user-service';
import { Circle, CircleVotersFilter, Commitment, Ranking, VoteCircleService } from '@vyf/vote-circle-service';
import { debounceTime, forkJoin, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { RankingStateModel, Placement } from '../models';
import { MemberAction } from '../../../shared/state/actions/member.action';
import { RankingAction } from './actions/ranking.action';

const DEFAULT_STATE: RankingStateModel = {
    selectedCircle: undefined,
    placements: undefined
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

    public ngxsOnInit(ctx: StateContext<RankingStateModel>): void {
        this.actions$.pipe(
            ofActionSuccessful(RankingAction.FetchRankings),
            debounceTime(450),
            switchMap(() => this.ablyService.authorize$()),
            switchMap(() => ctx.dispatch(new RankingAction.SubscribeRankingsChange())),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this._rankingChangedMessage$.pipe(
            map(msg => msg.data as Ranking),
            tap(ranking => ctx.dispatch(new RankingAction.RankingChanged(ranking))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
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

        const votersFilter: Partial<CircleVotersFilter> = {
            commitment: Commitment.Committed,
            hasBeenVoted: false
        };

        return ctx.dispatch([
            new RankingAction.FetchCircle(action.circleId),
            new RankingAction.FetchRankings(action.circleId),
            new MemberAction.Ranking.FilterMembers(action.circleId, votersFilter)
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
            //return of(rankingsMock()).pipe(
            map(res => res.data ?? []),
            switchMap(rankings =>
                forkJoin(this.mapRankings$(rankings)).pipe(
                    tap((placements) => {
                        ctx.patchState({
                            placements
                        });
                    })
                )
            )
        );
    }

    @Action(RankingAction.SubscribeRankingsChange)
    private subscribeRankingsChange(
        ctx: StateContext<RankingStateModel>,
        action: RankingAction.SubscribeRankingsChange
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
        const placements = ctx.getState().placements as Placement[];

        const rankingsLength = placements.length;
        const currentNumberedRankedIndex = placements.findIndex(placement => placement.ranking.number === action.ranking.number);

        // if the ranking changed object is placed not in any of the current watched rankings
        // ignore this ranking change event if the current watched list is under the threshold
        // add it to the end of rankings
        if (currentNumberedRankedIndex === -1 && rankingsLength >= 100) {
            return null;
        }

        if (currentNumberedRankedIndex === -1 && rankingsLength < 100) {
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

        // if the newly ranked number is higher the in the current watched rankings
        // ignore it
        const highestRankingNumber = placements.at(-1)?.ranking.number ?? 0;
        if (action.ranking.number > highestRankingNumber) {
            return null;
        }

        let nextRankedIndex = placements.findIndex(placement => placement.ranking.number === action.ranking.number + 1);

        if (nextRankedIndex === -1) {
            nextRankedIndex = rankingsLength - 1;
        }

        const currentPlacement = placements[currentNumberedRankedIndex];

        return ctx.setState(
            compose<RankingStateModel>(
                patch<RankingStateModel>({
                    placements: removeItem<Placement>(placement => placement.ranking.identityId === action.ranking.identityId)
                }),
                patch<RankingStateModel>({
                    placements: removeItem<Placement>(placement => placement.ranking.identityId === placements[currentNumberedRankedIndex].ranking.identityId)
                }),
                patch<RankingStateModel>({
                    placements: insertItem<Placement>(currentPlacement, currentNumberedRankedIndex)
                }),
                patch<RankingStateModel>({
                    placements: insertItem<Placement>(placements[currentNumberedRankedIndex], nextRankedIndex)
                })
            )
        );
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
