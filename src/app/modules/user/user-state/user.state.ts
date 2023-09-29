import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxsOnInit, State, StateContext } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { UserService } from '@vyf/user-service';
import { tap } from 'rxjs';
import { UserStateModel } from '../models/user-state.model';

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

  public ngxsOnInit(ctx: StateContext<UserStateModel>) {
	this.userService.me().pipe(
	  tap(res => {
		const user = res.data;
		ctx.setState({ user });
	  }),
	  takeUntilDestroyed()
	).subscribe();
  }
}
