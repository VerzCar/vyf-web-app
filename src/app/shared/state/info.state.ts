import { inject, Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { CirclePaginated, VoteCircleService } from '@vyf/vote-circle-service';
import { map, Observable, tap } from 'rxjs';
import { InfoStateModel } from '../models';
import { InfoAction } from './actions/info.action';

const DEFAULT_STATE: InfoStateModel = {
    circlesOpenCommitment: []
};

@State<InfoStateModel>({
    name: 'information',
    defaults: DEFAULT_STATE
})
@Injectable()
export class InfoState implements NgxsOnInit {
    private readonly voteCircleService = inject(VoteCircleService);

    @Action(InfoAction.FetchCirclesWithOpenCommitment)
    private fetchCirclesWithOpenCommitment(
        ctx: StateContext<InfoStateModel>,
        action: InfoAction.FetchCirclesWithOpenCommitment
    ): Observable<CirclePaginated[]> {
        return this.voteCircleService.circlesOpenCommitments().pipe(
            map(res => res.data),
            tap(circles => {
                ctx.patchState({ circlesOpenCommitment: circles });
            })
        );
    }

    public ngxsOnInit(ctx: StateContext<InfoStateModel>): void {
        ctx.dispatch(new InfoAction.FetchCirclesWithOpenCommitment());
    }

}
