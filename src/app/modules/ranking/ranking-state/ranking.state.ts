import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Action, NgxsAfterBootstrap, State, StateContext, StateOperator } from '@ngxs/store';
import { compose, patch, Predicate, updateItem, insertItem } from '@ngxs/store/operators';
import { AblyMessage, AblyService } from '@vyf/base';
import { Circle, Ranking, VoteCircleService, VoteCreateRequest } from '@vyf/vote-circle-service';
import { iif, map, Observable, of, Subject, tap } from 'rxjs';
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
export class RankingState implements NgxsAfterBootstrap {
    private readonly voteCircleService = inject(VoteCircleService);
    private readonly ablyService = inject(AblyService);

    private readonly _rankingChangedMsgSubject = new Subject<AblyMessage>();
    private readonly _rankingChangedMessage$: Observable<AblyMessage>;

    constructor() {
        this._rankingChangedMessage$ = this._rankingChangedMsgSubject.asObservable();
    }

    public ngxsAfterBootstrap(ctx: StateContext<RankingStateModel>): void {
        this._rankingChangedMessage$.pipe(
            map(msg => msg.data as Ranking),
            tap(ranking => ctx.dispatch(new RankingAction.RankingChanged(ranking))),
            takeUntilDestroyed()
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
        // this.ablyService.connect$().pipe(
        //     tap(() => console.log(this.ablyService.stats()))
        // ).subscribe(c => console.log(c))

        const { selectedCircle } = ctx.getState();

        const channel = this.ablyService.channel(`circle-${selectedCircle?.id}:rankings`);

        return this.ablyService.subscribeToChannel(channel, 'ranking changed', this._rankingChangedMsgSubject)
    }

    @Action(RankingAction.RankingChanged)
    private rankingChanged(
        ctx: StateContext<RankingStateModel>,
        action: RankingAction.RankingChanged
    ) {
        ctx.setState(
            patch<RankingStateModel>({
                rankings: upsertItem<Ranking>(ranking => ranking.id === action.ranking.id, action.ranking)
            })
        );
    }

}

function upsertItem<T>(
    selector: number | Predicate<T>,
    upsertValue: T
): StateOperator<T[]> {
    return compose<T[]>(
        items => <T[]>(items || []),
        // @ts-ignore
        iif<T[]>(
            // @ts-ignore
            items => Number(selector) === selector,
            // @ts-ignore
            iif<T[]>(
                // @ts-ignore
                items => selector < items.length,
                // @ts-ignore
                <StateOperator<T[]>>updateItem(selector, patch(upsertValue)),
                // @ts-ignore
                <StateOperator<T[]>>insertItem(upsertValue, <number>selector)
            ),
            // @ts-ignore
            iif<T[]>(
                // @ts-ignore
                items => items.some(<any>selector),
                // @ts-ignore
                <StateOperator<T[]>>updateItem(selector, patch(upsertValue)),
                // @ts-ignore
                <StateOperator<T[]>>insertItem(upsertValue)
            )
        )
    );
}
