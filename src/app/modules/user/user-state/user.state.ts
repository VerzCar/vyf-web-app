import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Action, NgxsAfterBootstrap, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { UserService } from '@vyf/user-service';
import { firstValueFrom, map, of, tap } from 'rxjs';
import { UserStateModel } from '../models/user-state.model';
import { UserAction } from './actions/user.action';

const DEFAULT_STATE: UserStateModel = {
    user: undefined
};

@State<UserStateModel>({
    name: 'user',
    defaults: DEFAULT_STATE
})
@Injectable()
export class UserState implements NgxsOnInit {
    private readonly userService = inject(UserService);

    @Action(UserAction.FetchUser)
    private async fetchUser(ctx: StateContext<UserStateModel>, action: UserAction.FetchUser) {
        const res = await firstValueFrom(this.userService.me());
        const user = res.data;
        return ctx.setState({ user });
    }

    @Action(UserAction.UpdateProfileImage)
    private updateProfileImage(ctx: StateContext<UserStateModel>, action: UserAction.UpdateProfileImage) {
        const user = ctx.getState().user;

        if (!user) {
            return of(null);
        }

        return this.userService.uploadUserProfileImage(action.image).pipe(
            map(res => res.data),
            tap(src => {
                ctx.patchState({
                    user: {
                        ...user,
                        profile: {
                            ...user.profile,
                            imageSrc: src ?? ''
                        }
                    }
                });
            })
        );
    }

    public async ngxsOnInit(ctx: StateContext<any>) {
        return await firstValueFrom(ctx.dispatch(new UserAction.FetchUser()));
    }
}
