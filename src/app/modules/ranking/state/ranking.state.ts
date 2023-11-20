import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Action, Actions, NgxsOnInit, ofActionSuccessful, State, StateContext } from '@ngxs/store';
import { append, compose, insertItem, patch, removeItem } from '@ngxs/store/operators';
import { AblyMessage, AblyService } from '@vyf/base';
import { Circle, Ranking, VoteCircleService, VoteCreateRequest } from '@vyf/vote-circle-service';
import { debounceTime, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { RankingStateModel } from '../models';
import { RankingAction } from './actions/ranking.action';

const DEFAULT_STATE: RankingStateModel = {
    selectedCircle: undefined,
    rankings: undefined
};

@State<RankingStateModel>({
    name: 'ranking',
    defaults: DEFAULT_STATE
})
@Injectable()
export class RankingState implements NgxsOnInit {
    private readonly voteCircleService = inject(VoteCircleService);
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
            tap(msg => console.log(msg)),
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

        return ctx.dispatch([
            new RankingAction.FetchCircle(action.circleId),
            new RankingAction.FetchRankings(action.circleId)
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
    ): Observable<Ranking[]> {
        return this.voteCircleService.rankings(action.circleId).pipe(
            //return of(rankingsMock()).pipe(
            map(res => res.data ?? []),
            tap((rankings) => {
                ctx.patchState({
                    rankings
                });
            })
        );
    }

    @Action(RankingAction.Vote)
    private vote(
        ctx: StateContext<RankingStateModel>,
        action: RankingAction.Vote
    ): Observable<boolean> {
        const voteCreateRequest: VoteCreateRequest = {
            circleId: action.circleId,
            elected: action.electedIdentId
        };

        return this.voteCircleService.createVote(voteCreateRequest).pipe(
            map(res => res.data)
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
        const rankings = ctx.getState().rankings as Ranking[];

        const rankingsLength = rankings.length;
        const currentNumberedRankedIndex = rankings.findIndex(ranking => ranking.number === action.ranking.number);

        // if the ranking changed object is placed not in any of the current watched rankings
        // ignore this ranking change event if the current watched list is under the threshold
        // add it to the end of rankings
        if (currentNumberedRankedIndex === -1 && rankingsLength >= 100) {
            return null;
        }

        if (currentNumberedRankedIndex === -1 && rankingsLength < 100) {
            return ctx.setState(
                patch<RankingStateModel>({
                    rankings: append<Ranking>([action.ranking])
                })
            );
        }

        // if the newly ranked number is higher the in the current watched rankings
        // ignore it
        const highestRankingNumber = rankings.at(-1)?.number ?? 0;
        if (action.ranking.number >= highestRankingNumber) {
            return null;
        }

        const nextRankedIndex = rankings.findIndex(ranking => ranking.number === action.ranking.number + 1);

        // position of next item for the current one could not be determined
        // ignore change event
        if (nextRankedIndex === -1) {
            return null;
        }

        return ctx.setState(
            compose<RankingStateModel>(
                patch<RankingStateModel>({
                    rankings: removeItem<Ranking>(ranking => ranking.identityId === action.ranking.identityId)
                }),
                patch<RankingStateModel>({
                    rankings: removeItem<Ranking>(ranking => ranking.identityId === rankings[currentNumberedRankedIndex].identityId)
                }),
                patch<RankingStateModel>({
                    rankings: insertItem<Ranking>(action.ranking, currentNumberedRankedIndex)
                }),
                patch<RankingStateModel>({
                    rankings: insertItem<Ranking>(rankings[currentNumberedRankedIndex], nextRankedIndex)
                })
            )
        );
    }

}
