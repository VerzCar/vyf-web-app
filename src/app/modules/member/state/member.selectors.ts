import { createPropertySelectors } from '@ngxs/store';
import { MemberStateModel } from '../models';
import { MemberState } from './member.state';

export class MemberSelectors {
    static slices = createPropertySelectors<MemberStateModel>(MemberState);
}
