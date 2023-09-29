import { createPropertySelectors } from '@ngxs/store';
import { UserStateModel } from '../models/user-state.model';
import { UserState } from './user.state';

export class UserSelectors {
  static slices = createPropertySelectors<UserStateModel>(UserState);
}
