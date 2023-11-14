import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { Circle, Ranking, VoteCircleService, VoteCreateRequest } from '@vyf/vote-circle-service';
import { map, Observable, of, tap } from 'rxjs';
import { RankingStateModel } from '../models';
import { RankingAction } from './actions/ranking.action';

const DEFAULT_STATE: RankingStateModel = {
    selectedCircle: undefined,
    topThreeRankings: undefined,
    rankings: undefined
};

@State<RankingStateModel>({
    name: 'ranking',
    defaults: DEFAULT_STATE
})
@Injectable()
export class RankingState {
    private readonly voteCircleService = inject(VoteCircleService);

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
                const topThreeRankings: Ranking[] = [];
                let countOfItemsToDelete = 0;

                for (const [index, ranking] of rankings.entries()) {
                    if (index >= 2) {
                        break;
                    }

                    switch (ranking.number) {
                        case 1: {
                            topThreeRankings[0] = ranking;
                            countOfItemsToDelete++;
                            break;
                        }
                        case 2: {
                            topThreeRankings[1] = ranking;
                            countOfItemsToDelete++;
                            break;
                        }
                        case 3: {
                            topThreeRankings[2] = ranking;
                            countOfItemsToDelete++;
                            break;
                        }
                    }
                }

                rankings.splice(0, countOfItemsToDelete);

                ctx.patchState({
                    topThreeRankings,
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

}
