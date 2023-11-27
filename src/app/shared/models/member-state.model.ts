import { Member } from './member.model';

export interface MemberStateModel {
    circleMembers: Member[] | undefined;
    circleUserMember: Member | undefined;
    rankingMembers: Member[] | undefined;
    rankingUserMember: Member | undefined;
}
