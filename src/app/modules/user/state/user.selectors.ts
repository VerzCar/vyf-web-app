import { createPropertySelectors } from '@ngxs/store';
import { UserStateModel } from '../models/user-state.model';
import { UserState } from './user.state';

export class UserSelectors {
    public static slices = createPropertySelectors<UserStateModel>(UserState);
}
