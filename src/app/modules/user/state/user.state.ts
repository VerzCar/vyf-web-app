import { inject, Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { UserService } from '@vyf/user-service';
import { firstValueFrom, map, tap } from 'rxjs';
import { UserStateModel } from '../models/user-state.model';
import { UserAction } from './actions/user.action';

@State<UserStateModel>({
    name: 'user'
})
@Injectable()
export class UserState implements NgxsOnInit {
    private readonly userService = inject(UserService);

    @Action(UserAction.FetchUser)
    private async fetchUser(ctx: StateContext<UserStateModel>) {
        const res = await firstValueFrom(this.userService.me());
        const user = res.data;
        return ctx.patchState({ user });
    }

    @Action(UserAction.UpdateProfileImage)
    private updateProfileImage(ctx: StateContext<UserStateModel>, action: UserAction.UpdateProfileImage) {
        const user = ctx.getState().user;

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

    @Action(UserAction.UpdateUser)
    private updateUser(ctx: StateContext<UserStateModel>, action: UserAction.UpdateUser) {
        return this.userService.updateUser(action.user).pipe(
            map(res => res.data),
            tap(user => {
                ctx.patchState({
                    user
                });
            })
        );
    }

    public async ngxsOnInit(ctx: StateContext<UserStateModel>) {
        return await firstValueFrom(ctx.dispatch(new UserAction.FetchUser()));
    }
}
