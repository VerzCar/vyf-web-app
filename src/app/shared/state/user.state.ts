import { inject, Injectable } from '@angular/core';
import { Action, NgxsAfterBootstrap, State, StateContext } from '@ngxs/store';
import { UserService } from '@vyf/user-service';
import { firstValueFrom, map, tap } from 'rxjs';
import { UserStorageService } from '../../core/services/user-storage.service';
import { UserStateModel } from '../models/user-state.model';
import { UserAction } from './actions/user.action';

@State<UserStateModel>({
    name: 'user'
})
@Injectable()
export class UserState implements NgxsAfterBootstrap {
    private readonly userService = inject(UserService);
    private readonly userStorageService = inject(UserStorageService);

    @Action(UserAction.InitUser)
    private async initUser(ctx: StateContext<UserStateModel>, action: UserAction.InitUser) {
        const user = await this.userStorageService.initUser();
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

    public async ngxsAfterBootstrap(ctx: StateContext<UserStateModel>) {
        await firstValueFrom(ctx.dispatch(new UserAction.InitUser()));
    }
}
