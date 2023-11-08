import { MemberStateModel } from './member-state.model';

export type CircleMember = Pick<MemberStateModel, 'selectedCircle' | 'members'>
