import { inject, Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { insertItem, patch } from '@ngxs/store/operators';
import { Circle, VoteCircleService } from '@vyf/vote-circle-service';
import { map, Observable, of, tap } from 'rxjs';
import { CirclesStateModel } from '../models';
import { CirclesAction } from './actions/circles.action';

const DEFAULT_STATE: CirclesStateModel = {
    myCircles: undefined,
    selectedCircle: undefined
};

@State<CirclesStateModel>({
    name: 'circles',
    defaults: DEFAULT_STATE
})
@Injectable()
export class CirclesState implements NgxsOnInit {
    private readonly voteCircleService = inject(VoteCircleService);

    public ngxsOnInit(ctx: StateContext<CirclesStateModel>): void {
        ctx.dispatch(new CirclesAction.FetchMyCircles());
    }

    @Action(CirclesAction.SelectCircle)
    private selectCircle(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.SelectCircle
    ): Observable<Circle> {
        const { selectedCircle } = ctx.getState();

        if (selectedCircle && selectedCircle.id === action.circleId) {
            return of(selectedCircle);
        }

        return ctx.dispatch(new CirclesAction.FetchCircle(action.circleId)).pipe(
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

    @Action(CirclesAction.FetchMyCircles)
    private fetchMyCircles(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.FetchMyCircles
    ): Observable<Circle[]> {
        return ctx.dispatch(new CirclesAction.FetchCircles()).pipe(
            map(() => ctx.getState().myCircles as Circle[])
        );
    }

}
