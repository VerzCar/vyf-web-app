import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { SnackbarService } from '@vyf/base';
import { SnackbarSuccessComponent, SnackbarSuccessComponentData } from '@vyf/component';
import { User, UserService } from '@vyf/user-service';
import { Circle, CircleCandidateCommitmentRequest, CirclePaginated, VoteCircleService } from '@vyf/vote-circle-service';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { MemberAction } from '../../../shared/state/actions/member.action';
import { UserSelectors } from '../../user/state/user.selectors';
import { CirclesStateModel } from '../models';
import { CirclesAction } from './actions/circles.action';

const DEFAULT_STATE: CirclesStateModel = {
    myCircles: [],
    selectedCircle: undefined,
    selectedCircleOwner: undefined,
    circlesOfInterest: []
};

@State<CirclesStateModel>({
    name: 'circles',
    defaults: DEFAULT_STATE
})
@Injectable()
export class CirclesState {
    private readonly voteCircleService = inject(VoteCircleService);
    private readonly userService = inject(UserService);
    private readonly store = inject(Store);
    private readonly snackbar = inject(SnackbarService);

    @Action(CirclesAction.SelectCircle)
    private selectCircle(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.SelectCircle
    ): Observable<Circle> {
        const { selectedCircle } = ctx.getState();

        if (selectedCircle && selectedCircle.id === action.circleId) {
            return of(selectedCircle);
        }

        return ctx.dispatch([
            new CirclesAction.FetchCircle(action.circleId),
            new MemberAction.Circle.FilterVoterMembers(action.circleId),
            new MemberAction.Circle.FilterCandidateMembers(action.circleId)
        ]).pipe(
            map(() => ctx.getState().selectedCircle as Circle),
            tap(circle => {
                const user = this.store.selectSnapshot(UserSelectors.slices.user);

                if (user && user.identityId === circle.createdFrom) {
                    return this.selectedCircleOwnerReducer(ctx, user);
                }

                return ctx.dispatch(new CirclesAction.FetchCircleOwner(circle.createdFrom));
            })
        );
    }

    @Action(CirclesAction.CreateCircle, { cancelUncompleted: true })
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
            )),
            tap(circle => {
                const data: SnackbarSuccessComponentData = {
                    message: 'This is your new circle!',
                    linkToLabel: circle.name,
                    linkToHref: `/circles/${circle.id}`
                };
                this.snackbar.openSuccess(SnackbarSuccessComponent, data);
            })
        );
    }

    @Action(CirclesAction.UpdateCircle, { cancelUncompleted: true })
    private updateCircle(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.UpdateCircle
    ): Observable<Circle> {
        return this.voteCircleService.updateCircle(action.circle).pipe(
            map(res => res.data),
            tap(circle => ctx.patchState({ selectedCircle: circle })),
            tap((circle) => ctx.setState(
                patch<CirclesStateModel>({
                    myCircles: updateItem<Circle>(myCircle => myCircle.id === circle.id, circle)
                })
            )),
            tap(() => {
                const data: SnackbarSuccessComponentData = {
                    message: 'Saved to circle.'
                };
                this.snackbar.openSuccess(SnackbarSuccessComponent, data);
            })
        );
    }

    @Action(CirclesAction.DeleteCircle)
    private deleteCircle(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.DeleteCircle
    ) {
        const selectedCircle = ctx.getState().selectedCircle as Circle;

        return this.voteCircleService.deleteCircle(selectedCircle?.id).pipe(
            tap(() => ctx.patchState({ selectedCircle: undefined })),
            tap(() => ctx.setState(
                patch<CirclesStateModel>({
                    myCircles: removeItem<Circle>(myCircle => myCircle.id === selectedCircle.id)
                })
            )),
            tap(() => {
                const data: SnackbarSuccessComponentData = {
                    message: 'Deleted circle successfully.'
                };
                this.snackbar.openSuccess(SnackbarSuccessComponent, data);
            })
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
                        imageSrc: src ? this.srcWithAttachedTimestamp(src) : ''
                    }
                });
            }),
            tap(() => {
                const data: SnackbarSuccessComponentData = {
                    message: 'Updated circle image successfully.'
                };
                this.snackbar.openSuccess(SnackbarSuccessComponent, data);
            })
        );
    }

    @Action(CirclesAction.CommittedToCircle)
    private committedToCircle(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.CommittedToCircle
    ) {
        const req: CircleCandidateCommitmentRequest = {
            commitment: action.commitment
        };

        return this.voteCircleService.updateCommitment(action.circleId, req).pipe(
            map(res => res.data),
            tap(() => ctx.dispatch(new MemberAction.Committed(action.circleId, action.commitment))),
            tap(() => {
                const data: SnackbarSuccessComponentData = {
                    message: 'Your commitment is registered.'
                };
                this.snackbar.openSuccess(SnackbarSuccessComponent, data);
            })
        );
    }

    @Action(CirclesAction.JoinCircleAsVoter)
    private joinCircleAsVoter(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.JoinCircleAsVoter
    ) {
        return this.voteCircleService.joinCircleAsVoter(action.circleId).pipe(
            map(res => res.data),
            tap(voter => ctx.dispatch(new MemberAction.JoinedAsVoter(voter))),
            tap(() => ctx.setState(
                patch<CirclesStateModel>({
                    circlesOfInterest: updateItem<CirclePaginated>(
                        circle => circle.id === action.circleId,
                        circle => ({ ...circle, votersCount: circle.votersCount ? circle.votersCount + 1 : 1 })
                    )
                })
            )),
            tap(() => {
                const data: SnackbarSuccessComponentData = {
                    message: 'You joined as a voter to the circle - Congratulations!'
                };
                this.snackbar.openSuccess(SnackbarSuccessComponent, data);
            })
        );
    }

    @Action(CirclesAction.JoinCircleAsCandidate)
    private joinCircleAsCandidate(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.JoinCircleAsCandidate
    ) {
        return this.voteCircleService.joinCircleAsCandidate(action.circleId).pipe(
            map(res => res.data),
            tap(candidate => ctx.dispatch(new MemberAction.JoinedAsCandidate(candidate))),
            tap(() => ctx.setState(
                patch<CirclesStateModel>({
                    circlesOfInterest: updateItem<CirclePaginated>(
                        circle => circle.id === action.circleId,
                        circle => ({ ...circle, candidatesCount: circle.candidatesCount ? circle.candidatesCount + 1 : 1 })
                    )
                })
            )),
            tap(() => {
                const data: SnackbarSuccessComponentData = {
                    message: 'Yeah! You joined as a candidate to the circle - Congratulations!'
                };
                this.snackbar.openSuccess(SnackbarSuccessComponent, data);
            })
        );
    }

    @Action(CirclesAction.InitUserCircles)
    private initUserCircles(
        ctx: StateContext<CirclesStateModel>
    ): Observable<void> | undefined {
        const { myCircles, circlesOfInterest } = ctx.getState();

        if (myCircles.length > 0 && circlesOfInterest.length > 0) {
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
        ctx: StateContext<CirclesStateModel>
    ): Observable<Circle[]> {
        return this.voteCircleService.circles().pipe(
            map(res => res.data !== null ? res.data : []),
            tap((circles) => ctx.patchState({ myCircles: circles }))
        );
    }

    @Action(CirclesAction.FetchCirclesOfInterest)
    private fetchCirclesOfInterest(
        ctx: StateContext<CirclesStateModel>
    ): Observable<CirclePaginated[]> {
        return this.voteCircleService.circlesOfInterest().pipe(
            map(res => res.data !== null ? res.data : []),
            tap((circles) => ctx.patchState({ circlesOfInterest: circles }))
        );
    }

    @Action(CirclesAction.FetchCircleOwner)
    private fetchCircleOwner(
        ctx: StateContext<CirclesStateModel>,
        action: CirclesAction.FetchCircleOwner
    ): Observable<User> {
        return this.userService.x(action.userIdentityId).pipe(
            map(res => res.data),
            tap(user => this.selectedCircleOwnerReducer(ctx, user))
        );
    }

    private srcWithAttachedTimestamp(src: string): string {
        return `${src}?timeStamp=${Date.now()}`;
    }

    private selectedCircleOwnerReducer(
        ctx: StateContext<CirclesStateModel>,
        user: User
    ) {
        return ctx.patchState({ selectedCircleOwner: user });
    }
}
