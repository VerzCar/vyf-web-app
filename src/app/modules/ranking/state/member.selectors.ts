import { createPropertySelectors, Selector } from '@ngxs/store';
import { Member, MemberStateModel } from '../models';
import { MemberState } from './member.state';

export class MemberSelectors {
    public static slices = createPropertySelectors<MemberStateModel>(MemberState);

    @Selector([MemberSelectors.slices.userMember])
    public static canVote(member: Member | undefined): boolean {
        if (!member) {
            return false;
        }

        return member.voter.votedFor === null;
    }
}
