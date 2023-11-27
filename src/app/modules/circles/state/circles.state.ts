import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { insertItem, patch } from '@ngxs/store/operators';
import { Circle, CirclePaginated, CircleVoterCommitmentRequest, CircleVotersFilter, VoteCircleService } from '@vyf/vote-circle-service';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { MemberAction } from '../../../shared/state/actions/member.action';
import { CirclesStateModel } from '../models';
import { CirclesAction } from './actions/circles.action';

const DEFAULT_STATE: CirclesStateModel = {
    myCircles: undefined,
    selectedCircle: undefined,
    circlesOfInterest: undefined
};

@State<CirclesStateModel>({
    name: 'circles',
    defaults: DEFAULT_STATE
})
@Injectable()
export class CirclesState {
    private readonly voteCircleService = inject(VoteCircleService);

    @Action(CirclesAction.SelectCircle)
    private selectCircle(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.SelectCircle
    ): Observable<Circle> {
        const { selectedCircle } = ctx.getState();

        if (selectedCircle && selectedCircle.id === action.circleId) {
            return of(selectedCircle);
        }

        const votersFilter: Partial<CircleVotersFilter> = {
            shouldContainUser: true
        };

        return ctx.dispatch([
            new CirclesAction.FetchCircle(action.circleId),
            new MemberAction.Circle.FilterMembers(action.circleId, votersFilter)
        ]).pipe(
            map(() => ctx.getState().selectedCircle as Circle)
        );
    }

    @Action(CirclesAction.CreateCircle)
    private createCircle(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.CreateCircle
    ): Observable<Circle> {
        return this.voteCircleService.createCircle(action.circle).pipe(
            map(res => res.data),
            tap((circle) => ctx.setState(
                patch<CirclesStateModel>({
                    myCircles: insertItem<Circle>(circle, 0)
                })
            ))
        );
    }

    @Action(CirclesAction.UpdateCircleImage)
    private updateCircleImage(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.UpdateCircleImage
    ) {
        const selectedCircle = ctx.getState().selectedCircle;

        if (!selectedCircle) {
            return of(null);
        }

        return this.voteCircleService.uploadCircleImage(action.image, selectedCircle.id).pipe(
            map(res => res.data),
            tap(src => {
                ctx.patchState({
                    selectedCircle: {
                        ...selectedCircle,
                        imageSrc: src ?? ''
                    }
                });
            })
        );
    }

    @Action(CirclesAction.CommittedToCircle)
    private committedToCircle(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.CommittedToCircle
    ) {
        const req: CircleVoterCommitmentRequest = {
            commitment: action.commitment
        };

        return this.voteCircleService.updateCommitment(action.circleId, req).pipe(
            map(res => res.data),
            switchMap(() => ctx.dispatch(new MemberAction.Circle.Committed(action.circleId, action.commitment)))
        );
    }

    @Action(CirclesAction.InitUserCircles)
    private initUserCircles(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.InitUserCircles
    ): Observable<void> | undefined {
        const { myCircles, circlesOfInterest } = ctx.getState();

        if (myCircles && circlesOfInterest) {
            return undefined;
        }

        return ctx.dispatch([
            new CirclesAction.FetchCircles(),
            new CirclesAction.FetchCirclesOfInterest()
        ]);
    }

    @Action(CirclesAction.FetchCircle)
    private fetchCircle(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.FetchCircle
    ): Observable<Circle> {
        return this.voteCircleService.circle(action.circleId).pipe(
            map(res => res.data),
            tap((circle) => ctx.patchState({ selectedCircle: circle }))
        );
    }

    @Action(CirclesAction.FetchCircles)
    private fetchCircles(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.FetchCircles
    ): Observable<Circle[]> {
        return this.voteCircleService.circles().pipe(
            map(res => res.data !== null ? res.data : []),
            tap((circles) => ctx.patchState({ myCircles: circles }))
        );
    }

    @Action(CirclesAction.FetchCirclesOfInterest)
    private fetchCirclesOfInterest(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.FetchCirclesOfInterest
    ): Observable<CirclePaginated[]> {
        return this.voteCircleService.circlesOfInterest().pipe(
            map(res => res.data !== null ? res.data : []),
            tap((circles) => ctx.patchState({ circlesOfInterest: circles }))
        );
    }
}
