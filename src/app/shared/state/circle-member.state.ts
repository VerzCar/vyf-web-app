import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { MemberStateModel } from '../models'
import { MemberState } from './member.state';

const DEFAULT_STATE: MemberStateModel = {
    members: undefined,
    userMember: undefined
};

@State<MemberStateModel>({
    name: 'circleMember',
    defaults: DEFAULT_STATE
})
@Injectable()
export class CircleMemberState extends MemberState {
}
